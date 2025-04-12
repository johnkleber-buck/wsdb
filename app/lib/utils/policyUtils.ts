import { Policy, User, Workstation } from '../types';

/**
 * Evaluate if a user meets the criteria for a policy
 */
export function evaluatePolicy(
  policy: Policy, 
  user: User, 
  workstation: Workstation
): { compliant: boolean; violations: string[] } {
  if (!policy.criteria) return { compliant: true, violations: [] };

  // Convert criteria from JSON if needed
  const criteria = typeof policy.criteria === 'string' 
    ? JSON.parse(policy.criteria) 
    : policy.criteria;

  const violations: string[] = [];
  
  // Check criteria conditions
  for (const [key, value] of Object.entries(criteria)) {
    // Process operators for comparison (supports arrays, exact match, etc.)
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Handle complex criteria with operators
      if ('equals' in value) {
        // User property check
        if (key in user && user[key as keyof User] !== value.equals) {
          violations.push(`${policy.policyName}: ${key} must equal ${value.equals}`);
        }
        // Workstation property check
        else if (key in workstation && workstation[key as keyof Workstation] !== value.equals) {
          violations.push(`${policy.policyName}: ${key} must equal ${value.equals}`);
        }
      }
      
      if ('contains' in value) {
        // Check if array property contains a value
        if (key in user) {
          const userValue = user[key as keyof User];
          if (Array.isArray(userValue) && !userValue.includes(value.contains)) {
            violations.push(`${policy.policyName}: ${key} must contain ${value.contains}`);
          }
        }
        
        if (key in workstation) {
          const wsValue = workstation[key as keyof Workstation];
          if (Array.isArray(wsValue) && !wsValue.includes(value.contains)) {
            violations.push(`${policy.policyName}: ${key} must contain ${value.contains}`);
          }
        }
      }
      
      if ('minimum' in value) {
        // Check numeric properties meet minimum value
        if (key in user) {
          const userValue = user[key as keyof User];
          if (typeof userValue === 'number' && userValue < value.minimum) {
            violations.push(`${policy.policyName}: ${key} must be at least ${value.minimum}`);
          }
        }
        
        if (key in workstation) {
          const wsValue = workstation[key as keyof Workstation];
          if (typeof wsValue === 'number' && wsValue < value.minimum) {
            violations.push(`${policy.policyName}: ${key} must be at least ${value.minimum}`);
          }
        }
      }
    } 
    // Handle simple exact match criteria
    else {
      // User property check
      if (key in user && user[key as keyof User] !== value) {
        violations.push(`${policy.policyName}: ${key} must be ${value}`);
      }
      // Workstation property check
      else if (key in workstation && workstation[key as keyof Workstation] !== value) {
        violations.push(`${policy.policyName}: ${key} must be ${value}`);
      }
    }
  }

  // Special checks for location-based policies
  if ('location' in criteria && criteria.location) {
    // Location match policy
    if (user.location !== workstation.location) {
      violations.push(`${policy.policyName}: User and workstation locations must match (${user.location} vs ${workstation.location})`);
    }
  }
  
  // Special checks for security clearance
  if ('securityClearance' in criteria && criteria.securityClearance) {
    const requiredClearance = criteria.securityClearance;
    const clearanceLevels = ['None', 'Confidential', 'Secret', 'Top Secret'];
    
    const requiredIndex = clearanceLevels.indexOf(requiredClearance);
    const userIndex = clearanceLevels.indexOf(user.securityClearance);
    
    if (userIndex < requiredIndex) {
      violations.push(`${policy.policyName}: User security clearance (${user.securityClearance}) is insufficient (requires ${requiredClearance})`);
    }
  }

  // Determine compliance based on policy type and violations
  if (policy.allowedDisallowed === 'Allowed') {
    return {
      compliant: violations.length === 0,
      violations
    };
  } else {
    // For 'Disallowed' policies, finding matches (violations) is actually good
    return {
      compliant: violations.length > 0,
      violations: []  // Don't report violations for 'Disallowed' policies
    };
  }
}

/**
 * Check if a user can be assigned to a workstation based on all applicable policies
 * 
 * @param policies Array of all policy objects
 * @param user The user object to check
 * @param workstation The workstation object to check
 * @returns Object with compliant status and any policy violations
 */
export function checkAllPolicies(
  policies: Policy[], 
  user: User, 
  workstation: Workstation
): { compliant: boolean; violations: string[] } {
  const violations: string[] = [];

  // Global policies (apply to all workstations)
  const globalPolicies = policies.filter(policy => 
    policy.policyName.startsWith('global_')
  );
  
  // Get workstation-specific policies
  const workstationPolicies = policies.filter(policy => 
    workstation.policyAssignments.includes(policy.policyName)
  );
  
  // Combine policies to evaluate
  const allApplicablePolicies = [...globalPolicies, ...workstationPolicies];

  // Check each policy
  for (const policy of allApplicablePolicies) {
    const result = evaluatePolicy(policy, user, workstation);
    if (!result.compliant) {
      violations.push(...result.violations);
    }
  }

  // Special case: Check location-based restrictions even if not explicitly in policy
  // Assuming locations must match unless there's a specific exception
  if (user.location !== workstation.location) {
    // Check if there's a policy allowing cross-location assignments
    const hasCrossLocationPolicy = allApplicablePolicies.some(
      p => p.policyName.includes('cross_location') && p.allowedDisallowed === 'Allowed'
    );
    
    if (!hasCrossLocationPolicy) {
      violations.push('Location policy: User and workstation locations must match');
    }
  }

  return {
    compliant: violations.length === 0,
    violations
  };
}

/**
 * Format policy violations into human-readable messages
 */
export function formatPolicyViolations(violations: string[]): string[] {
  if (!violations.length) return [];
  
  return violations.map(violation => {
    // Make messages more human readable
    return violation.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  });
}

/**
 * Check if a specific policy applies to a workstation
 */
export function doesPolicyApplyToWorkstation(policy: Policy, workstation: Workstation): boolean {
  // Global policies apply to all workstations
  if (policy.policyName.startsWith('global_')) return true;
  
  // Check if the policy is in the workstation's policy assignments
  return workstation.policyAssignments.includes(policy.policyName);
}
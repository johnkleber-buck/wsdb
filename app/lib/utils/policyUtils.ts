import { Policy, User, Workstation } from '../types';

/**
 * Evaluate if a user meets the criteria for a policy
 */
export function evaluatePolicy(policy: Policy, user: User, workstation: Workstation): boolean {
  if (!policy.criteria) return true;

  // Convert criteria from JSON if needed
  const criteria = typeof policy.criteria === 'string' 
    ? JSON.parse(policy.criteria) 
    : policy.criteria;

  for (const [key, value] of Object.entries(criteria)) {
    // Check user properties
    if (key in user) {
      if (user[key as keyof User] !== value) {
        return policy.allowedDisallowed === 'Disallowed';
      }
    }
    
    // Check workstation properties
    if (key in workstation) {
      if (workstation[key as keyof Workstation] !== value) {
        return policy.allowedDisallowed === 'Disallowed';
      }
    }
  }

  return policy.allowedDisallowed === 'Allowed';
}

/**
 * Check if a user can be assigned to a workstation based on all applicable policies
 */
export function checkAllPolicies(
  policies: Policy[], 
  user: User, 
  workstation: Workstation
): { compliant: boolean; violations: string[] } {
  const violations: string[] = [];

  // Get relevant policies for this workstation
  const applicablePolicies = policies.filter(policy => 
    workstation.policyAssignments.includes(policy.policyName)
  );

  for (const policy of applicablePolicies) {
    const compliant = evaluatePolicy(policy, user, workstation);
    if (!compliant) {
      violations.push(policy.policyName);
    }
  }

  return {
    compliant: violations.length === 0,
    violations
  };
}
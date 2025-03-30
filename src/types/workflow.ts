export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  agentId: string;
  name: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

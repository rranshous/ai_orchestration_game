export enum ProjectStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  completed: boolean;
  success?: boolean;
}

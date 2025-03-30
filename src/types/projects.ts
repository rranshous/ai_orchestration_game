export enum ProjectStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  ABANDONED = "abandoned", // New status to track abandoned projects
  COMPLETED = "completed",
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  completed: boolean;
  success?: boolean;
  startTime?: number; // When the project was started
  endTime?: number; // When the project was completed or abandoned
  abandoned?: boolean; // Flag to track abandoned projects
}

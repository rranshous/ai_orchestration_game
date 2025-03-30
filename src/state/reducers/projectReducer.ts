import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateId } from '../../utils/helpers';
import { ProjectStatus, Project } from '../../types/projects';

// Simple project templates for MVP
const projectTemplates = [
  {
    name: "User Authentication System",
    description: "Implement a secure user authentication system with login/logout functionality.",
  },
  {
    name: "Data Visualization Dashboard",
    description: "Create a dashboard to display key metrics with interactive charts.",
  },
  {
    name: "API Integration Module",
    description: "Develop a module to integrate with third-party payment processing API.",
  },
  {
    name: "Bug Fix: Login Form",
    description: "Fix issues with the login form validation and error handling.",
  },
  {
    name: "Performance Optimization",
    description: "Optimize database queries for faster response times.",
  },
];

// Function to generate a new project
const generateProject = (): Project => {
  const template = projectTemplates[Math.floor(Math.random() * projectTemplates.length)];
  
  return {
    id: generateId(),
    name: template.name,
    description: template.description,
    status: ProjectStatus.PENDING,
    completed: false,
  };
};

export interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
}

const initialState: ProjectState = {
  projects: [generateProject(), generateProject()], // Start with two random projects
  activeProjectId: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    createProject: (state) => {
      state.projects.push(generateProject());
    },
    
    startProject: (state, action: PayloadAction<{ projectId: string }>) => {
      state.activeProjectId = action.payload.projectId;
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        project.status = ProjectStatus.IN_PROGRESS;
      }
    },
    
    completeProject: (state, action: PayloadAction<{ projectId: string; success: boolean }>) => {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        project.status = ProjectStatus.COMPLETED;
        project.completed = true;
        project.success = action.payload.success;
      }
      state.activeProjectId = null;
    }
  }
});

export const { 
  createProject,
  startProject,
  completeProject
} = projectSlice.actions;

export default projectSlice.reducer;

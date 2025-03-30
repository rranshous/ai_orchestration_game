import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateId } from '../../utils/helpers';
import { ProjectStatus, Project } from '../../types/projects';
import { showToast } from './notificationReducer';

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
  {
    name: "Security Audit Implementation",
    description: "Implement security recommendations from the recent penetration test.",
  },
  {
    name: "Legacy System Migration",
    description: "Migrate data and functionality from legacy system to new platform.",
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
  autoAssignTimer: number | null;
}

const initialState: ProjectState = {
  projects: [generateProject(), generateProject()], // Start with two random projects
  activeProjectId: null,
  autoAssignTimer: null
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    createProject: (state) => {
      state.projects.push(generateProject());
    },
    
    assignRandomProject: (state) => {
      state.projects.push(generateProject());
    },
    
    startProject: (state, action: PayloadAction<{ projectId: string }>) => {
      // If there's an active project, abandon it
      if (state.activeProjectId) {
        const currentProject = state.projects.find(p => p.id === state.activeProjectId);
        if (currentProject) {
          currentProject.status = ProjectStatus.ABANDONED;
          currentProject.abandoned = true;
          currentProject.endTime = Date.now();
        }
      }
      
      // Start the new project
      state.activeProjectId = action.payload.projectId;
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        project.status = ProjectStatus.IN_PROGRESS;
        
        // Only set startTime if it's a new project, not an abandoned one being resumed
        if (!project.startTime) {
          project.startTime = Date.now();
        }
        
        // Clear the abandoned flag if it was previously abandoned
        project.abandoned = false;
      }
    },
    
    completeProject: (state, action: PayloadAction<{ projectId: string; success: boolean }>) => {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        project.status = ProjectStatus.COMPLETED;
        project.completed = true;
        project.success = action.payload.success;
        project.endTime = Date.now();
      }
      state.activeProjectId = null;
    },
    
    setAutoAssignTimer: (state, action: PayloadAction<number | null>) => {
      state.autoAssignTimer = action.payload;
    }
  }
});

export const { 
  createProject,
  assignRandomProject,
  startProject,
  completeProject,
  setAutoAssignTimer
} = projectSlice.actions;

// Thunk to automatically assign new projects periodically
export const startAutoAssignProjects = () => (dispatch: any) => {
  // Start with assigning one project immediately
  dispatch(assignRandomProject());
  
  // Set up interval to assign projects every 1-2 minutes
  const timerId = window.setInterval(() => {
    dispatch(assignRandomProject());
    dispatch(showToast({ 
      type: "info", 
      message: "A new project has been assigned to you." 
    }));
  }, 60000 + Math.random() * 60000); // Between 1-2 minutes
  
  dispatch(setAutoAssignTimer(timerId as unknown as number));
};

export const stopAutoAssignProjects = () => (dispatch: any, getState: any) => {
  const { autoAssignTimer } = getState().projects;
  if (autoAssignTimer) {
    clearInterval(autoAssignTimer);
    dispatch(setAutoAssignTimer(null));
  }
};

export default projectSlice.reducer;

# AI Orchestrator - Projects and Feedback

## 5. Simplified Project System
Basic project management for the MVP.

### Implementation Details:
- Implement simple project definition
- Create project display component
- Add basic success/failure evaluation

### Data Structures:
```typescript
// Project types
interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  completed: boolean;
  success?: boolean;
}

enum ProjectStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

// Project Card Component
interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  isActive: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  isActive,
}) => {
  // Determine status color
  let statusColor = "";
  switch (project.status) {
    case ProjectStatus.PENDING:
      statusColor = "bg-gray-600";
      break;
    case ProjectStatus.IN_PROGRESS:
      statusColor = "bg-blue-600";
      break;
    case ProjectStatus.COMPLETED:
      statusColor = project.success ? "bg-green-600" : "bg-red-600";
      break;
  }
  
  return (
    <div 
      className={`
        project-card p-4 rounded-lg border cursor-pointer transition-colors
        ${isActive ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-700'}
        bg-gray-800
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <div className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
          {project.status}
        </div>
      </div>
      
      <div className="text-sm text-gray-400 mb-3">{project.description}</div>
      
      {project.completed && (
        <div className={`text-sm ${project.success ? 'text-green-400' : 'text-red-400'}`}>
          {project.success ? 'Completed successfully' : 'Failed to meet requirements'}
        </div>
      )}
    </div>
  );
};
```

### Project Generation:
```typescript
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
function generateProject(): Project {
  const template = projectTemplates[Math.floor(Math.random() * projectTemplates.length)];
  
  return {
    id: generateId(),
    name: template.name,
    description: template.description,
    status: ProjectStatus.PENDING,
    completed: false,
  };
}

// Project redux actions
const projectActions = {
  createProject: () => ({
    type: 'project/create' as const,
    payload: { project: generateProject() }
  }),
  
  startProject: (projectId: string) => ({
    type: 'project/start' as const,
    payload: { projectId }
  }),
  
  completeProject: (projectId: string, success: boolean) => ({
    type: 'project/complete' as const,
    payload: { projectId, success }
  }),
};

// Project reducer
interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
}

const initialProjectState: ProjectState = {
  projects: [],
  activeProjectId: null,
};

function projectReducer(state: ProjectState = initialProjectState, action: any): ProjectState {
  switch (action.type) {
    case 'project/create':
      return {
        ...state,
        projects: [...state.projects, action.payload.project],
      };
    
    case 'project/start':
      return {
        ...state,
        activeProjectId: action.payload.projectId,
        projects: state.projects.map(project => 
          project.id === action.payload.projectId
            ? { ...project, status: ProjectStatus.IN_PROGRESS }
            : project
        ),
      };
    
    case 'project/complete':
      return {
        ...state,
        projects: state.projects.map(project => 
          project.id === action.payload.projectId
            ? { 
                ...project, 
                status: ProjectStatus.COMPLETED,
                completed: true,
                success: action.payload.success,
              }
            : project
        ),
      };
    
    default:
      return state;
  }
}
```

## 6. Basic Feedback System
Provides simple player feedback on their performance.

### Implementation Details:
- Add basic toast notifications for success/error
- Implement simple project completion feedback

### Component Implementation:
```typescript
// Notification types
interface Notification {
  id: string;
  type: "info" | "success" | "error";
  message: string;
}

// Toast Notification component
interface ToastProps {
  notification: Notification;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  notification,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  // Color based on notification type
  let bgColor = "bg-blue-700";
  let icon = "ℹ️";
  
  switch (notification.type) {
    case "success":
      bgColor = "bg-green-700";
      icon = "✅";
      break;
    case "error":
      bgColor = "bg-red-700";
      icon = "❌";
      break;
    case "info":
    default:
      bgColor = "bg-blue-700";
      icon = "ℹ️";
  }
  
  return (
    <div 
      className={`
        fixed bottom-4 right-4 p-3 rounded-md shadow-lg 
        ${bgColor} max-w-md z-50
      `}
    >
      <div className="flex items-center">
        <div className="mr-2">{icon}</div>
        <div className="flex-grow text-sm">{notification.message}</div>
        <button 
          className="ml-2 text-white/70 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Project Completion Dialog
interface CompletionDialogProps {
  project: Project;
  onClose: () => void;
}

export const CompletionDialog: React.FC<CompletionDialogProps> = ({
  project,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">
            {project.success ? '🎉' : '😔'}
          </div>
          <h2 className="text-xl font-bold">
            Project {project.success ? 'Completed Successfully' : 'Failed'}
          </h2>
        </div>
        
        <p className="text-gray-300 mb-4">
          {project.success 
            ? `You've successfully completed the project "${project.name}".` 
            : `The project "${project.name}" did not meet the requirements.`}
        </p>
        
        <div className="text-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
```

### Redux Implementation:
```typescript
// Notification state
interface NotificationState {
  toasts: Notification[];
  completedProject: Project | null;
}

const initialNotificationState: NotificationState = {
  toasts: [],
  completedProject: null,
};

// Notification actions
const notificationActions = {
  showToast: (type: "info" | "success" | "error", message: string) => ({
    type: 'notification/showToast' as const,
    payload: {
      notification: {
        id: generateId(),
        type,
        message,
      },
    },
  }),
  
  hideToast: (id: string) => ({
    type: 'notification/hideToast' as const,
    payload: { id },
  }),
  
  showCompletionDialog: (project: Project) => ({
    type: 'notification/showCompletionDialog' as const,
    payload: { project },
  }),
  
  hideCompletionDialog: () => ({
    type: 'notification/hideCompletionDialog' as const,
  }),
};

// Notification reducer
function notificationReducer(state: NotificationState = initialNotificationState, action: any): NotificationState {
  switch (action.type) {
    case 'notification/showToast':
      return {
        ...state,
        toasts: [...state.toasts, action.payload.notification],
      };
    
    case 'notification/hideToast':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload.id),
      };
    
    case 'notification/showCompletionDialog':
      return {
        ...state,
        completedProject: action.payload.project,
      };
    
    case 'notification/hideCompletionDialog':
      return {
        ...state,
        completedProject: null,
      };
    
    default:
      return state;
  }
}
```

### Simple Help System
Basic instruction system for new players.

```typescript
// Help Dialog component
interface HelpDialogProps {
  onClose: () => void;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">How to Play</h2>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <h3 className="text-lg font-semibold mb-2">Welcome to AI Orchestrator</h3>
            <p className="text-gray-300">
              In this game, you manage the flow of information between AI agents to develop software.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Basic Gameplay</h3>
            <ol className="list-decimal pl-5 text-gray-300 space-y-2">
              <li>Start a project from the project list</li>
              <li>Enter requirements in the Product Vision AI</li>
              <li>Click "Generate Specifications" to get output</li>
              <li>Copy the output using the Copy button</li>
              <li>Paste the specifications into the Code Writer AI</li>
              <li>Click "Generate Code" to create the implementation</li>
              <li>Complete the workflow to finish the project</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Controls</h3>
            <ul className="list-disc pl-5 text-gray-300 space-y-2">
              <li><strong>Copy Button</strong>: Copies output from an AI agent</li>
              <li><strong>Paste Button</strong>: Pastes content into an AI agent's input</li>
              <li><strong>Generate Button</strong>: Tells the AI to process input</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

// Help state management
interface HelpState {
  showHelp: boolean;
}

const initialHelpState: HelpState = {
  showHelp: true, // Show help on first load
};

// Help actions
const helpActions = {
  showHelp: () => ({
    type: 'help/show' as const,
  }),
  
  hideHelp: () => ({
    type: 'help/hide' as const,
  }),
};

// Help reducer
function helpReducer(state: HelpState = initialHelpState, action: any): HelpState {
  switch (action.type) {
    case 'help/show':
      return {
        ...state,
        showHelp: true,
      };
    
    case 'help/hide':
      return {
        ...state,
        showHelp: false,
      };
    
    default:
      return state;
  }
}
```
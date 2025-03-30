import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { hideToast, hideCompletionDialog } from '../../state/reducers/notificationReducer';
import AgentPanel from './AgentPanel';
import DocumentationPanel from './DocumentationPanel';
import NotificationsPanel from './NotificationsPanel';
import ProjectSelector from '../projects/ProjectSelector';
import ProjectCompletionDialog from '../feedback/ProjectCompletionDialog';
import Toast from '../feedback/Toast';

const Workspace: React.FC = () => {
  const layout = useAppSelector(state => state.workspace.layout);
  const toasts = useAppSelector(state => state.notifications.toasts);
  const completedProject = useAppSelector(state => state.notifications.completedProject);
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);
  const dispatch = useAppDispatch();
  
  // Only show one agent panel at a time
  const currentAgentPanel = layout.agentPanels[activeAgentIndex];
  const totalAgents = layout.agentPanels.length;
  
  const handleNextAgent = () => {
    setActiveAgentIndex((prevIndex) => (prevIndex + 1) % totalAgents);
  };
  
  const handlePrevAgent = () => {
    setActiveAgentIndex((prevIndex) => (prevIndex - 1 + totalAgents) % totalAgents);
  };
  
  return (
    <div className="grid grid-cols-12 gap-2 h-screen w-screen bg-gray-800 p-4">
      {/* Agent Panel with Navigation - Takes 6/12 columns instead of 8/12 */}
      <div className="col-span-6 h-full">
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-2 px-2">
            <button 
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
              onClick={handlePrevAgent}
            >
              ← Previous Agent
            </button>
            <h2 className="text-lg font-medium">{currentAgentPanel.title}</h2>
            <button 
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
              onClick={handleNextAgent}
            >
              Next Agent →
            </button>
          </div>
          <div className="flex-1">
            <AgentPanel 
              key={currentAgentPanel.id} 
              id={currentAgentPanel.id} 
              title={currentAgentPanel.title} 
              agentId={currentAgentPanel.agentId}
            />
          </div>
        </div>
      </div>
      
      {/* Three vertical panels for Projects, Documentation, and Notifications - Each takes 2 columns */}
      {/* Projects Panel */}
      <div className="col-span-2 h-full overflow-hidden">
        <div className="bg-gray-900 rounded-lg shadow-md h-full overflow-auto">
          <ProjectSelector />
        </div>
      </div>
      
      {/* Documentation Panel */}
      {layout.documentationPanel.visible && (
        <div className="col-span-2 h-full overflow-hidden">
          <div className="bg-gray-900 rounded-lg shadow-md h-full overflow-auto">
            <DocumentationPanel />
          </div>
        </div>
      )}
      
      {/* Notifications Panel */}
      {layout.notificationsPanel.visible && (
        <div className="col-span-2 h-full overflow-hidden">
          <div className="bg-gray-900 rounded-lg shadow-md h-full overflow-auto">
            <NotificationsPanel />
          </div>
        </div>
      )}
      
      {/* Toasts - Moved to bottom left to avoid obscuring notifications panel */}
      <div className="toast-container fixed bottom-4 left-4 space-y-2 z-50">
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            notification={toast} 
            onClose={() => dispatch(hideToast({ id: toast.id }))}
          />
        ))}
      </div>
      
      {/* Project Completion Dialog */}
      {completedProject && (
        <ProjectCompletionDialog 
          project={completedProject}
          onClose={() => dispatch(hideCompletionDialog())}
        />
      )}
    </div>
  );
};

export default Workspace;

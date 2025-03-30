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
    <div className="grid grid-cols-12 grid-rows-6 gap-2 h-screen w-screen bg-gray-800 p-4">
      {/* Agent Panel with Navigation */}
      <div className="col-span-8 row-span-6">
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
      
      {/* Changed layout: Split the right panel into two columns */}
      <div className="col-span-4 row-span-6 grid grid-cols-1 grid-rows-2 gap-4">
        {/* Top section: Projects and Documentation */}
        <div className="row-span-1 flex flex-col space-y-4">
          {/* Project Selection Panel */}
          <div className="bg-gray-900 rounded-lg shadow-md h-1/3 overflow-hidden">
            <ProjectSelector />
          </div>
          
          {/* Documentation Panel - Takes up most of the space */}
          {layout.documentationPanel.visible && (
            <div className="bg-gray-900 rounded-lg shadow-md flex-1 overflow-auto">
              <DocumentationPanel />
            </div>
          )}
        </div>
        
        {/* Bottom section: Notifications Panel - Takes up the entire second row */}
        {layout.notificationsPanel.visible && (
          <div className="bg-gray-900 rounded-lg shadow-md row-span-1 overflow-auto">
            <NotificationsPanel />
          </div>
        )}
      </div>
      
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

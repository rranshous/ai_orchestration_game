import React from 'react';
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
  const dispatch = useAppDispatch();
  
  return (
    <div className="grid grid-cols-12 grid-rows-6 gap-2 h-screen w-screen bg-gray-800 p-4">
      {/* Agent Panels */}
      <div className="col-span-8 row-span-6 grid grid-cols-2 gap-4">
        {layout.agentPanels.map(panel => (
          <AgentPanel key={panel.id} id={panel.id} title={panel.title} agentId={panel.agentId} />
        ))}
      </div>
      
      {/* Right side panels */}
      <div className="col-span-4 row-span-6 space-y-4">
        {/* Project Selection Panel */}
        <div className="bg-gray-900 rounded-lg shadow-md h-1/4 overflow-hidden">
          <ProjectSelector />
        </div>
        
        {/* Documentation Panel */}
        {layout.documentationPanel.visible && (
          <div className="bg-gray-900 rounded-lg shadow-md h-2/4 overflow-hidden">
            <DocumentationPanel />
          </div>
        )}
        
        {/* Notifications Panel */}
        {layout.notificationsPanel.visible && (
          <div className="bg-gray-900 rounded-lg shadow-md h-1/4 overflow-hidden">
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

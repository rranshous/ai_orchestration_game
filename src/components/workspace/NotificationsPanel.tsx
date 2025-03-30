import React from 'react';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { hideToast } from '../../state/reducers/notificationReducer';

const NotificationsPanel: React.FC = () => {
  const toasts = useAppSelector(state => state.notifications.toasts);
  const activeProject = useAppSelector(state => {
    const activeProjectId = state.projects.activeProjectId;
    return activeProjectId 
      ? state.projects.projects.find(p => p.id === activeProjectId) 
      : null;
  });
  const dispatch = useAppDispatch();
  
  const handleDismiss = (id: string) => {
    dispatch(hideToast({ id }));
  };
  
  return (
    <div className="notifications-panel p-4 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
          {toasts.length}
        </span>
      </div>
      
      {activeProject && (
        <div className="active-project mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded">
          <p className="text-sm font-medium">Active Project: {activeProject.name}</p>
          <p className="text-xs text-gray-400 mt-1">{activeProject.description}</p>
          <p className="text-xs text-blue-300 mt-2 italic">Follow the workflow in the Documentation Panel to complete this project</p>
        </div>
      )}
      
      <div className="notifications-list flex-grow overflow-auto space-y-2">
        {toasts.length === 0 ? (
          <div className="text-gray-500 italic text-center mt-6">
            No notifications yet
          </div>
        ) : (
          toasts.map(toast => {
            // Determine styling based on notification type
            let bgColor = "bg-gray-800";
            let borderColor = "border-gray-700";
            let icon = "ℹ️";
            
            if (toast.type === "success") {
              bgColor = "bg-green-900/30";
              borderColor = "border-green-700";
              icon = "✅";
            } else if (toast.type === "error") {
              bgColor = "bg-red-900/30";
              borderColor = "border-red-700";
              icon = "❌";
            }
            
            return (
              <div 
                key={toast.id} 
                className={`p-3 rounded border ${borderColor} ${bgColor} flex justify-between items-start`}
              >
                <div className="flex">
                  <span className="mr-2">{icon}</span>
                  <span className="text-sm">{toast.message}</span>
                </div>
                <button
                  className="ml-2 text-gray-500 hover:text-gray-300"
                  onClick={() => handleDismiss(toast.id)}
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;

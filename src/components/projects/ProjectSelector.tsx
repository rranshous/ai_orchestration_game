import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { startProject, startAutoAssignProjects, stopAutoAssignProjects } from '../../state/reducers/projectReducer';
import { resetWorkflow } from '../../state/reducers/workflowReducer';
import { showToast } from '../../state/reducers/notificationReducer';
import ProjectCard from './ProjectCard';
import { ProjectStatus } from '../../types/projects';

const ProjectSelector: React.FC = () => {
  const { projects, activeProjectId } = useAppSelector(state => state.projects);
  const dispatch = useAppDispatch();
  
  // Start auto-assigning projects when component mounts
  useEffect(() => {
    dispatch(startAutoAssignProjects());
    
    return () => {
      dispatch(stopAutoAssignProjects());
    };
  }, [dispatch]);
  
  const handleStartProject = (projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId);
    if (!selectedProject) return;
    
    // If the user has an active project and tries to start a new one, show a warning
    if (activeProjectId && activeProjectId !== projectId) {
      dispatch(showToast({ 
        type: "error", 
        message: "Warning: Your previous project was marked as abandoned." 
      }));
    }
    
    // Start the project
    dispatch(startProject({ projectId }));
    dispatch(resetWorkflow());
    
    // Show toast notification
    dispatch(showToast({ 
      type: "success", 
      message: "Project started! Check workflow documentation for next steps."
    }));
  };
  
  // Filter projects by status
  const pendingProjects = projects.filter(p => p.status === ProjectStatus.PENDING);
  const activeProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS);
  const abandonedProjects = projects.filter(p => p.status === ProjectStatus.ABANDONED);
  const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED);
  
  return (
    <div className="project-selector p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Projects</h2>
        <span className="text-sm text-gray-400">Auto-assigned</span>
      </div>
      
      <div className="project-list flex-grow overflow-auto space-y-3">
        {pendingProjects.length === 0 && activeProjects.length === 0 && 
         abandonedProjects.length === 0 && completedProjects.length === 0 ? (
          <div className="text-gray-500 italic text-center mt-6">
            No projects available. Create a new project to begin.
          </div>
        ) : (
          <>
            {activeProjects.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-blue-400 mb-2">Active Project</h3>
                {activeProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleStartProject(project.id)}
                    isActive={activeProjectId === project.id}
                  />
                ))}
              </div>
            )}
            
            {abandonedProjects.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-red-400 mb-2">Abandoned Projects</h3>
                {abandonedProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleStartProject(project.id)}
                    isActive={false}
                  />
                ))}
              </div>
            )}
            
            {pendingProjects.length > 0 && (
              <div className={activeProjects.length > 0 ? "mt-4" : ""}>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Available Projects</h3>
                {pendingProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleStartProject(project.id)}
                    isActive={activeProjectId === project.id}
                  />
                ))}
              </div>
            )}
            
            {completedProjects.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Completed Projects</h3>
                {completedProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => {}} // No action for completed projects
                    isActive={false}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectSelector;

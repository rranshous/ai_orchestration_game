import React from 'react';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { createProject, startProject } from '../../state/reducers/projectReducer';
import { resetWorkflow } from '../../state/reducers/workflowReducer';
import { showToast } from '../../state/reducers/notificationReducer';
import ProjectCard from './ProjectCard';

const ProjectSelector: React.FC = () => {
  const { projects, activeProjectId } = useAppSelector(state => state.projects);
  const dispatch = useAppDispatch();
  
  const handleCreateProject = () => {
    dispatch(createProject());
    dispatch(showToast({ type: "info", message: "New project created!" }));
  };
  
  const handleStartProject = (projectId: string) => {
    dispatch(startProject({ projectId }));
    dispatch(resetWorkflow());
    dispatch(showToast({ 
      type: "success", 
      message: "Project started! Follow the workflow to complete it."
    }));
  };
  
  // Filter projects by status
  const pendingProjects = projects.filter(p => p.status === "pending");
  const completedProjects = projects.filter(p => p.status === "completed");
  
  return (
    <div className="project-selector p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Projects</h2>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
          onClick={handleCreateProject}
        >
          New Project
        </button>
      </div>
      
      <div className="project-list flex-grow overflow-auto space-y-3">
        {pendingProjects.length === 0 && completedProjects.length === 0 ? (
          <div className="text-gray-500 italic text-center mt-6">
            No projects available. Create a new project to begin.
          </div>
        ) : (
          <>
            {pendingProjects.length > 0 && (
              <div>
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

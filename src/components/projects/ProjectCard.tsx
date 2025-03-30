import React from 'react';
import { Project, ProjectStatus } from '../../types/projects';
import ProjectTimer from './ProjectTimer';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  isActive: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  isActive,
}) => {
  // Determine status color
  let statusColor = "";
  let statusText = "";
  
  switch (project.status) {
    case ProjectStatus.PENDING:
      statusColor = "bg-gray-600";
      statusText = "Pending";
      break;
    case ProjectStatus.IN_PROGRESS:
      statusColor = "bg-blue-600";
      statusText = "In Progress";
      break;
    case ProjectStatus.ABANDONED:
      statusColor = "bg-red-600";
      statusText = "Abandoned";
      break;
    case ProjectStatus.COMPLETED:
      statusColor = project.success ? "bg-green-600" : "bg-red-600";
      statusText = project.success ? "Completed" : "Failed";
      break;
  }
  
  // Abandoned projects should have a different border
  const cardBorder = project.abandoned 
    ? "border-red-700 border-2"
    : isActive ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-700";
  
  return (
    <div 
      className={`
        project-card p-4 rounded-lg border cursor-pointer transition-colors mb-2
        ${cardBorder}
        bg-gray-800 hover:bg-gray-750
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <div className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
          {statusText}
        </div>
      </div>
      
      <div className="text-sm text-gray-400 mb-3">{project.description}</div>
      
      <div className="flex justify-between items-center">
        {(project.status === ProjectStatus.IN_PROGRESS || project.completed) && (
          <ProjectTimer 
            startTime={project.startTime || 0} 
            isActive={project.status === ProjectStatus.IN_PROGRESS} 
          />
        )}
        
        {project.completed && (
          <div className={`text-sm ${project.success ? 'text-green-400' : 'text-red-400'}`}>
            {project.success ? '✓ Completed successfully' : '✗ Failed to meet requirements'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

import React from 'react';
import { Project, ProjectStatus } from '../../types/projects';

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
        project-card p-4 rounded-lg border cursor-pointer transition-colors mb-2
        ${isActive ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-700'}
        bg-gray-800 hover:bg-gray-750
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <div className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
          {project.status.replace('_', ' ')}
        </div>
      </div>
      
      <div className="text-sm text-gray-400 mb-3">{project.description}</div>
      
      {project.completed && (
        <div className={`text-sm ${project.success ? 'text-green-400' : 'text-red-400'}`}>
          {project.success ? '✓ Completed successfully' : '✗ Failed to meet requirements'}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;

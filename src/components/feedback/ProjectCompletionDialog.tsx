import React from 'react';
import { Project } from '../../types/projects';

interface ProjectCompletionDialogProps {
  project: Project;
  onClose: () => void;
}

const ProjectCompletionDialog: React.FC<ProjectCompletionDialogProps> = ({
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
        
        <p className="text-gray-300 mb-4 text-center">
          {project.success 
            ? `You've successfully completed the project "${project.name}".` 
            : `The project "${project.name}" did not meet the requirements.`}
        </p>
        
        <div className="mt-8 bg-gray-700/50 p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-2">Project Details</h3>
          <p className="text-sm text-gray-300">{project.description}</p>
        </div>
        
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

export default ProjectCompletionDialog;

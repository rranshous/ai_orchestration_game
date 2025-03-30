import React from 'react';
import { useAppSelector } from '../../state/hooks';
import { WorkflowStep } from '../../types/workflow';

const DocumentationPanel: React.FC = () => {
  const workflow = useAppSelector(state => state.workflow.current);
  const activeStepId = useAppSelector(state => state.workflow.activeStepId);
  const activeProject = useAppSelector(state => {
    const activeProjectId = state.projects.activeProjectId;
    return activeProjectId 
      ? state.projects.projects.find(p => p.id === activeProjectId) 
      : null;
  });
  
  // Find the active step in the workflow
  const activeStep = workflow.steps.find(step => step.id === activeStepId) || workflow.steps[0];
  
  // Find the active agent based on the active step
  const activeAgent = useAppSelector(
    state => state.agents.find(a => a.id === activeStep.agentId)
  );
  
  const renderStepStatus = (step: WorkflowStep) => {
    if (step.isCompleted) return "✅ Completed";
    if (step.isActive) return "🔵 Active";
    return "⚪ Pending";
  };
  
  return (
    <div className="documentation-panel p-4 h-full flex flex-col overflow-hidden">
      <h2 className="text-lg font-semibold mb-4">Workflow Documentation</h2>
      
      {activeProject && (
        <div className="bg-gray-700/30 p-3 rounded-md mb-4">
          <h3 className="text-md font-medium text-white mb-1">Current Project</h3>
          <p className="text-sm text-gray-300">{activeProject.name}: {activeProject.description}</p>
        </div>
      )}
      
      <div className="workflow-overview mb-4">
        <h3 className="text-md font-medium text-blue-400 mb-2">
          {workflow.name} - Progress
        </h3>
        <div className="workflow-steps space-y-3 overflow-y-auto">
          {workflow.steps.map((step, index) => (
            <div key={step.id} className="relative">
              <div 
                className={`
                  p-3 rounded border 
                  ${step.isCompleted ? 'bg-green-900/30 border-green-700' : 
                    step.isActive ? 'bg-blue-900/30 border-blue-700' : 
                    'bg-gray-800 border-gray-700'}
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-gray-700">
                      {index + 1}
                    </span>
                    {step.name}
                  </span>
                  <span className="text-sm text-gray-400">{renderStepStatus(step)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="current-step border-t border-gray-700 pt-4 flex-grow overflow-y-auto">
        <h3 className="text-md font-medium text-blue-400 mb-2">Current Step: {activeStep.name}</h3>
        <p className="text-gray-300 mb-4">{activeStep.description}</p>
        
        {activeAgent && (
          <div className="agent-instructions mt-4">
            <h4 className="text-sm font-medium text-gray-300">Using {activeAgent.name}</h4>
            <p className="text-sm text-gray-400 mt-1">{activeAgent.description}</p>
            
            <div className="mt-4 p-3 bg-gray-800 rounded">
              <p className="text-sm text-gray-300">
                {activeAgent.type === "product_vision" ? (
                  "1. The project description is pre-populated in the Project Description field.\n2. Add any additional requirements or details.\n3. Click 'Generate Specifications' to create detailed specs.\n4. After processing, click the 'Copy' button to copy the output for use in the Code Writer."
                ) : activeAgent.type === "code_writer" ? (
                  "1. Click the 'Paste' button to paste in the specifications from the Product Vision AI.\n2. Click 'Generate Code' to create the implementation.\n3. After code is generated, click 'Complete Project' to finish."
                ) : (
                  "Follow the instructions for this agent to complete the workflow step."
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationPanel;

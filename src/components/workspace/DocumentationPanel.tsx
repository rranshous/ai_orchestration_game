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
    state => state.agents.find(a => a.id === activeStep?.agentId)
  );
  
  const renderStepStatus = (step: WorkflowStep) => {
    if (step.isCompleted) return "✅ Completed";
    if (step.isActive) return "🔵 Active";
    return "⚪ Pending";
  };
  
  return (
    <div className="documentation-panel p-4 h-full flex flex-col">
      {/* Make the entire content area scrollable instead of individual sections */}
      <div className="overflow-y-auto flex-1">
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
          <div className="workflow-steps space-y-3">
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
        
        {activeStep && (
          <div className="current-step border-t border-gray-700 pt-4">
            <h3 className="text-md font-medium text-blue-400 mb-2">Current Step: {activeStep.name}</h3>
            <p className="text-gray-300 mb-4">{activeStep.description}</p>
            
            {activeAgent && (
              <div className="agent-instructions mt-4">
                <h4 className="text-sm font-medium text-gray-300">
                  Using {activeAgent.name}
                  {activeStep.id === "step-certification" && 
                    <span className="ml-2 text-yellow-400">(Navigate to Code Writer AI panel)</span>
                  }
                </h4>
                <p className="text-sm text-gray-400 mt-1">{activeAgent.description}</p>
                
                <div className="mt-4 p-3 bg-gray-800 rounded">
                  <p className="text-sm text-gray-300">
                    {activeAgent.type === "product_vision" ? (
                      "1. Review the project description provided above.\n2. Formulate comprehensive technical requirements based on the project needs.\n3. Click 'Generate Specifications' to create detailed specifications document.\n4. Use your system clipboard to copy the generated specifications."
                    ) : activeAgent.type === "code_writer" ? (
                      activeStep.id === "step-certification" ? 
                      "1. Review the generated code implementation for correctness and quality.\n2. Verify that all requirements have been implemented according to specifications.\n3. Click 'Certify Code' when you've confirmed the code meets all requirements." :
                      "1. Paste the technical specifications from the previous step.\n2. Click 'Generate Code' to create the implementation.\n3. Once generated, the code will need to be reviewed in the certification step."
                    ) : (
                      "Please refer to the workflow documentation for guidance on this step."
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationPanel;

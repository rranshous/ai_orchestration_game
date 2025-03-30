import React from 'react';

interface HelpDialogProps {
  onClose: () => void;
}

const HelpDialog: React.FC<HelpDialogProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">How to Play</h2>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <h3 className="text-lg font-semibold mb-2">Welcome to AI Orchestrator</h3>
            <p className="text-gray-300">
              In this game, you manage the flow of information between AI agents to develop software.
              You act as the human middleware in an AI-driven development process.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Basic Gameplay</h3>
            <ol className="list-decimal pl-5 text-gray-300 space-y-2">
              <li>Start a project from the project list</li>
              <li>Enter requirements in the Product Vision AI</li>
              <li>Click "Generate Specifications" to get output</li>
              <li>Copy the output using your clipboard (Ctrl+C/Cmd+C)</li>
              <li>Navigate to the Code Writer AI</li>
              <li>Paste the specifications (Ctrl+V/Cmd+V)</li>
              <li>Click "Generate Code" to create the implementation</li>
              <li>Review and certify the generated code</li>
              <li>Complete the project</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Controls</h3>
            <ul className="list-disc pl-5 text-gray-300 space-y-2">
              <li><strong>Next/Previous Agent</strong>: Switch between AI agent panels</li>
              <li><strong>Generate Button</strong>: Tells the AI to process input</li>
              <li><strong>Certify Button</strong>: Approves the final code output</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Workflow</h3>
            <p className="text-gray-300">
              Follow the workflow steps shown in the Documentation panel. Each step requires you to use the corresponding AI agent to complete that phase of the project.
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpDialog;

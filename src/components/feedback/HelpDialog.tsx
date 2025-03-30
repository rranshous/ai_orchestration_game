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
              In this simulation, you are an enterprise software operator responsible for coordinating AI agents to complete development projects efficiently.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Basic Workflow</h3>
            <ol className="list-decimal pl-5 text-gray-300 space-y-2">
              <li>Select an available project from your queue</li>
              <li>Follow the development workflow steps sequentially</li>
              <li>For each step, use the appropriate AI system to process information</li>
              <li>Transfer data between systems as needed</li>
              <li>Complete all workflow steps to finish the project</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Available AI Systems</h3>
            <ul className="list-disc pl-5 text-gray-300 space-y-2">
              <li><strong>Product Vision AI:</strong> Converts business requirements into technical specifications</li>
              <li><strong>Code Writer AI:</strong> Generates code implementation from specifications</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Navigation & Controls</h3>
            <p className="text-gray-300">
              Use the navigation buttons to switch between different AI systems. The workflow documentation panel will guide you through each step of the development process.
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Begin Work
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpDialog;

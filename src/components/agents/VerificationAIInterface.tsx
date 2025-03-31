import React from 'react';
import { useAppDispatch } from '../../state/hooks';
import { AiAgent, setInput } from '../../state/reducers/agentReducer';
import BaseAgentInterface from './BaseAgentInterface';

interface VerificationAIInterfaceProps {
  agent: AiAgent;
}

const VerificationAIInterface: React.FC<VerificationAIInterfaceProps> = ({ agent }) => {
  const dispatch = useAppDispatch();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setInput({ agentId: agent.id, input: e.target.value }));
  };
  
  return (
    <BaseAgentInterface agent={agent}>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Set a max height for the content area to ensure button remains visible */}
        <div className="flex-grow grid grid-cols-2 gap-4 max-h-[65vh] mb-4">
          <div className="overflow-hidden flex flex-col">
            <label className="block text-sm font-medium text-gray-300 mb-1">Code & Requirements</label>
            <textarea 
              className="w-full flex-grow bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white font-mono overflow-auto"
              value={agent.currentInput}
              onChange={handleInputChange}
              placeholder="Paste code and requirements here for verification..."
              readOnly={agent.status === "processing"}
            />
          </div>
          <div className="overflow-hidden flex flex-col">
            <label className="block text-sm font-medium text-gray-300 mb-1">Verification Results</label>
            <div className="w-full flex-grow bg-gray-700 border border-gray-600 rounded p-2 overflow-auto">
              {agent.currentOutput ? (
                <pre className="text-yellow-300 whitespace-pre-wrap font-mono text-sm">{agent.currentOutput}</pre>
              ) : (
                <div className="text-gray-500 italic text-center mt-10">
                  Verification results will appear here
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Make sure the button section is always visible and fixed at bottom */}
        <div className="mt-auto flex justify-between items-center sticky bottom-0 bg-gray-900 pt-2">
          <div className="text-sm text-gray-400">
            {agent.status === "processing" ? "Analyzing code quality and compliance..." : "Ready for verification"}
          </div>
          <button 
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
            onClick={() => document.dispatchEvent(new CustomEvent('processAgent', { detail: { agentId: agent.id } }))}
            disabled={agent.status === "processing" || !agent.currentInput.trim()}
          >
            Verify Code
          </button>
        </div>
      </div>
    </BaseAgentInterface>
  );
};

export default VerificationAIInterface;

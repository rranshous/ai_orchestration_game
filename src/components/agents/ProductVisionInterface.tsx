import React from 'react';
import { useAppDispatch } from '../../state/hooks';
import { AiAgent, setInput } from '../../state/reducers/agentReducer';
import BaseAgentInterface from './BaseAgentInterface';

interface ProductVisionInterfaceProps {
  agent: AiAgent;
}

const ProductVisionInterface: React.FC<ProductVisionInterfaceProps> = ({ agent }) => {
  const dispatch = useAppDispatch();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setInput({ agentId: agent.id, input: e.target.value }));
  };
  
  return (
    <BaseAgentInterface agent={agent}>
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-300 mb-1">Project Description</label>
          <textarea 
            className="w-full h-40 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            value={agent.currentInput}
            onChange={handleInputChange}
            placeholder="Enter project description or requirements..."
            disabled={agent.status === "processing"}
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Generated Specifications</label>
          <div className="w-full h-48 bg-gray-700 border border-gray-600 rounded p-3 overflow-auto">
            {agent.currentOutput ? (
              <pre className="text-green-300 whitespace-pre-wrap">{agent.currentOutput}</pre>
            ) : (
              <div className="text-gray-500 italic text-center mt-10">
                Specifications will appear here after processing
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => document.dispatchEvent(new CustomEvent('processAgent', { detail: { agentId: agent.id } }))}
            disabled={agent.status === "processing" || !agent.currentInput.trim()}
          >
            Generate Specifications
          </button>
        </div>
      </div>
    </BaseAgentInterface>
  );
};

export default ProductVisionInterface;

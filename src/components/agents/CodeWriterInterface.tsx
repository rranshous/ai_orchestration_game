import React from 'react';
import { useAppDispatch } from '../../state/hooks';
import { AiAgent, setInput } from '../../state/reducers/agentReducer';
import BaseAgentInterface from './BaseAgentInterface';

interface CodeWriterInterfaceProps {
  agent: AiAgent;
}

const CodeWriterInterface: React.FC<CodeWriterInterfaceProps> = ({ agent }) => {
  const dispatch = useAppDispatch();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setInput({ agentId: agent.id, input: e.target.value }));
  };
  
  return (
    <BaseAgentInterface agent={agent}>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-grow grid grid-cols-2 gap-4">
          <div className="overflow-hidden flex flex-col">
            <label className="block text-sm font-medium text-gray-300 mb-1">Specifications</label>
            <textarea 
              className="w-full flex-grow bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white font-mono overflow-auto"
              value={agent.currentInput}
              onChange={handleInputChange}
              placeholder="Paste specifications here..."
              readOnly={agent.status === "processing"}
            />
          </div>
          <div className="overflow-hidden flex flex-col">
            <label className="block text-sm font-medium text-gray-300 mb-1">Generated Code</label>
            <div className="w-full flex-grow bg-gray-700 border border-gray-600 rounded p-2 overflow-auto">
              {agent.currentOutput ? (
                <pre className="text-green-300 whitespace-pre-wrap font-mono text-sm">{agent.currentOutput}</pre>
              ) : (
                <div className="text-gray-500 italic text-center mt-10">
                  Code will appear here after processing
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {agent.status === "processing" ? "Processing..." : "Ready"}
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => document.dispatchEvent(new CustomEvent('processAgent', { detail: { agentId: agent.id } }))}
            disabled={agent.status === "processing" || !agent.currentInput.trim()}
          >
            Generate Code
          </button>
        </div>
      </div>
    </BaseAgentInterface>
  );
};

export default CodeWriterInterface;

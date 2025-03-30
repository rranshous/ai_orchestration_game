import React, { ReactNode, useEffect } from 'react';
import { useAppDispatch } from '../../state/hooks';
import { AiAgent, setInput, startProcessing, completeProcessing, setError } from '../../state/reducers/agentReducer';
import { useClipboard } from '../../context/ClipboardContext';
import { delay } from '../../utils/helpers';

interface BaseAgentProps {
  agent: AiAgent;
  children?: ReactNode;
}

const BaseAgentInterface: React.FC<BaseAgentProps> = ({ agent, children }) => {
  const dispatch = useAppDispatch();
  const { content, sourceId, setCopyContent } = useClipboard();
  
  // Add event listener for processing
  useEffect(() => {
    const handleProcessEvent = (e: CustomEvent) => {
      if (e.detail?.agentId === agent.id) {
        handleProcess();
      }
    };
    
    // Add event listener
    document.addEventListener('processAgent', handleProcessEvent as EventListener);
    
    // Clean up
    return () => {
      document.removeEventListener('processAgent', handleProcessEvent as EventListener);
    };
  }, [agent.id, agent.currentInput, agent.status]);
  
  const handleCopy = () => {
    if (agent.currentOutput) {
      setCopyContent(agent.currentOutput, agent.id);
    }
  };
  
  const handlePaste = () => {
    if (content && sourceId !== agent.id) {
      dispatch(setInput({ agentId: agent.id, input: content }));
    }
  };
  
  const handleProcess = async () => {
    if (agent.status === "processing" || !agent.currentInput.trim()) {
      return;
    }
    
    dispatch(startProcessing({ agentId: agent.id }));
    
    try {
      // Simulate processing time
      await delay(agent.processingTime);
      
      // Generate response based on agent type
      let output = "";
      
      if (agent.type === "product_vision") {
        output = `REQUIREMENTS:\n- User authentication functionality\n- Dashboard for data visualization\n- Export capabilities for reports\n\nFEATURES:\n- Login/logout system\n- Interactive charts\n- PDF and CSV export options\n\nNON-FUNCTIONAL REQUIREMENTS:\n- Response time under 2 seconds\n- Mobile-friendly interface\n- GDPR compliance`;
      } else if (agent.type === "code_writer") {
        output = `function createAuthSystem() {\n  // Authentication system implementation\n  class AuthService {\n    constructor() {\n      this.isLoggedIn = false;\n    }\n    \n    login(username, password) {\n      // Implementation here\n      this.isLoggedIn = true;\n      return true;\n    }\n    \n    logout() {\n      this.isLoggedIn = false;\n    }\n  }\n  \n  return new AuthService();\n}`;
      }
      
      dispatch(completeProcessing({ agentId: agent.id, output }));
    } catch (error) {
      console.error("Error processing agent:", error);
      dispatch(setError({ 
        agentId: agent.id, 
        errorMessage: "An error occurred while processing your request." 
      }));
    }
  };
  
  // Calculate copy/paste button states
  const canCopy = agent.currentOutput && agent.status === "complete";
  const canPaste = !!content && sourceId !== agent.id;
  
  return (
    <div className="agent-interface flex flex-col h-full">
      <div className="agent-actions flex justify-end space-x-2 mb-4">
        <button
          className={`px-3 py-1 rounded text-sm ${canPaste ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
          onClick={handlePaste}
          disabled={!canPaste}
        >
          Paste
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${canCopy ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
          onClick={handleCopy}
          disabled={!canCopy}
        >
          Copy
        </button>
      </div>
      
      {children}
      
      {agent.status === "error" && (
        <div className="error-message mt-4 p-3 bg-red-900 border border-red-700 rounded-md">
          <p className="text-red-300 text-sm">{agent.errorMessage || "An error occurred"}</p>
        </div>
      )}
      
      {agent.status === "processing" && (
        <div className="processing-indicator mt-4 flex justify-center">
          <div className="animate-pulse text-blue-400">Processing...</div>
        </div>
      )}
    </div>
  );
};

export default BaseAgentInterface;

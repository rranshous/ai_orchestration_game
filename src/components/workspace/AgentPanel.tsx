import React from 'react';
import { useAppSelector } from '../../state/hooks';
import ProductVisionInterface from '../agents/ProductVisionInterface';
import CodeWriterInterface from '../agents/CodeWriterInterface';
import VerificationAIInterface from '../agents/VerificationAIInterface';

interface AgentPanelProps {
  id: string; // Kept for future use but marked as unused
  title: string;
  agentId: string;
}

const AgentPanel: React.FC<AgentPanelProps> = ({ title, agentId }) => {
  const agent = useAppSelector(state => state.agents.find(a => a.id === agentId));
  
  if (!agent) {
    return <div>Agent not found</div>;
  }
  
  return (
    <div 
      className={`
        agent-panel bg-gray-900 rounded-lg shadow-lg overflow-hidden
        h-full flex flex-col
      `}
    >
      <div className="agent-header bg-gray-800 p-3 border-b border-gray-700">
        <div className="font-semibold text-lg">{title}</div>
      </div>
      
      <div className="agent-content flex-1 p-4 overflow-auto">
        {agentId === 'product-vision' && <ProductVisionInterface agent={agent} />}
        {agentId === 'code-writer' && <CodeWriterInterface agent={agent} />}
        {agentId === 'verification-ai' && <VerificationAIInterface agent={agent} />}
      </div>
    </div>
  );
};

export default AgentPanel;

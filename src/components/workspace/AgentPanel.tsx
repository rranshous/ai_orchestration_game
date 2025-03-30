import React from 'react';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
import { setActiveAgent } from '../../state/reducers/workspaceReducer';
import ProductVisionInterface from '../agents/ProductVisionInterface';
import CodeWriterInterface from '../agents/CodeWriterInterface';

interface AgentPanelProps {
  id: string;
  title: string;
  agentId: string;
}

const AgentPanel: React.FC<AgentPanelProps> = ({ id, title, agentId }) => {
  const agent = useAppSelector(state => state.agents.find(a => a.id === agentId));
  const activeAgentId = useAppSelector(state => state.workspace.activeAgentId);
  const dispatch = useAppDispatch();
  
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
      </div>
    </div>
  );
};

export default AgentPanel;

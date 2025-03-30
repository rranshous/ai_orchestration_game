import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorkspaceState {
  layout: {
    agentPanels: {
      id: string;
      agentId: string;
      title: string;
    }[];
    documentationPanel: {
      visible: boolean;
    };
    notificationsPanel: {
      visible: boolean;
    };
  };
  activeAgentId: string | null;
}

const initialState: WorkspaceState = {
  layout: {
    agentPanels: [
      { id: 'panel-product-vision', agentId: 'product-vision', title: 'Product Vision AI' },
      { id: 'panel-code-writer', agentId: 'code-writer', title: 'Code Writer AI' },
    ],
    documentationPanel: {
      visible: true,
    },
    notificationsPanel: {
      visible: true,
    },
  },
  activeAgentId: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setActiveAgent(state, action: PayloadAction<string | null>) {
      state.activeAgentId = action.payload;
    },
    toggleDocumentationPanel(state) {
      state.layout.documentationPanel.visible = !state.layout.documentationPanel.visible;
    },
    toggleNotificationsPanel(state) {
      state.layout.notificationsPanel.visible = !state.layout.notificationsPanel.visible;
    },
  },
});

export const { 
  setActiveAgent,
  toggleDocumentationPanel,
  toggleNotificationsPanel
} = workspaceSlice.actions;

export default workspaceSlice.reducer;

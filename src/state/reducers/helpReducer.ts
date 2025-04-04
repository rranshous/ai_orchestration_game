import { createSlice } from '@reduxjs/toolkit';

export interface HelpState {
  showHelp: boolean;
}

const initialState: HelpState = {
  showHelp: false, // Changed from true to false - don't show help dialog on first launch
};

const helpSlice = createSlice({
  name: 'help',
  initialState,
  reducers: {
    show: (state) => {
      state.showHelp = true;
    },
    
    hide: (state) => {
      state.showHelp = false;
    }
  }
});

export const { show, hide } = helpSlice.actions;

export default helpSlice.reducer;

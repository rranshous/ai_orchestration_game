import React, { useEffect } from 'react';
import { ClipboardProvider } from './context/ClipboardContext';
import Workspace from './components/workspace/Workspace';
import HelpDialog from './components/feedback/HelpDialog';
import { useAppSelector, useAppDispatch } from './state/hooks';
import { hide } from './state/reducers/helpReducer';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const showHelp = useAppSelector(state => state.help.showHelp);

  useEffect(() => {
    // Initialize any necessary state on app load
    // For example, load saved game if it exists
    const savedGame = localStorage.getItem('aiOrchestrator_saveGame');
    if (savedGame) {
      try {
        const gameState = JSON.parse(savedGame);
        // Dispatch action to load saved game
        // dispatch(loadSavedGame(gameState));
      } catch (error) {
        console.error('Error loading saved game:', error);
      }
    }
  }, [dispatch]);

  return (
    <ClipboardProvider>
      <div className="app-container h-screen w-screen overflow-hidden">
        <Workspace />
        {showHelp && <HelpDialog onClose={() => dispatch(hide())} />}
      </div>
    </ClipboardProvider>
  );
};

export default App;

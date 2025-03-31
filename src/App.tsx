import React, { useEffect } from 'react';
import { ClipboardProvider } from './context/ClipboardContext';
import Workspace from './components/workspace/Workspace';
import LoginScreen from './components/login/LoginScreen';
import HelpDialog from './components/feedback/HelpDialog';
import { useAppSelector, useAppDispatch } from './state/hooks';
import { hide } from './state/reducers/helpReducer';
import { startBossMessages, stopBossMessages } from './state/reducers/bossReducer';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const showHelp = useAppSelector(state => state.help.showHelp);
  const isLoggedIn = useAppSelector(state => state.user.isLoggedIn);

  useEffect(() => {
    // Only initialize boss messages after user is logged in
    if (isLoggedIn) {
      dispatch(startBossMessages());
      
      return () => {
        dispatch(stopBossMessages());
      };
    }
  }, [dispatch, isLoggedIn]);

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <LoginScreen />;
  }

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

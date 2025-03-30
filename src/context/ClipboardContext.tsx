import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ClipboardContextValue {
  content: string;
  sourceId: string | null;
  setCopyContent: (content: string, sourceId: string) => void;
  clearClipboard: () => void;
}

export const ClipboardContext = createContext<ClipboardContextValue | null>(null);

export const ClipboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<string>('');
  const [sourceId, setSourceId] = useState<string | null>(null);
  
  const setCopyContent = useCallback((content: string, sourceId: string) => {
    setContent(content);
    setSourceId(sourceId);
  }, []);
  
  const clearClipboard = useCallback(() => {
    setContent('');
    setSourceId(null);
  }, []);
  
  return (
    <ClipboardContext.Provider value={{ content, sourceId, setCopyContent, clearClipboard }}>
      {children}
    </ClipboardContext.Provider>
  );
};

export const useClipboard = (): ClipboardContextValue => {
  const context = useContext(ClipboardContext);
  if (!context) {
    throw new Error('useClipboard must be used within a ClipboardProvider');
  }
  return context;
};

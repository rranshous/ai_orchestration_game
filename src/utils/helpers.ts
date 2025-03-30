/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Delays execution for the specified time
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formats seconds into MM:SS or HH:MM:SS format
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Validates transfer between agents
 */
export function validateTransfer(sourceAgentId: string, targetAgentId: string, content: string): boolean {
  // Cannot transfer to the same agent
  if (sourceAgentId === targetAgentId) {
    return false;
  }
  
  // Content cannot be empty
  if (!content.trim()) {
    return false;
  }
  
  // For the simplified MVP workflow:
  // - Only allow transfer from Product Vision to Code Writer
  if (sourceAgentId === 'product-vision' && targetAgentId === 'code-writer') {
    return true;
  }
  
  return false;
}

/**
 * Saves the game state to localStorage
 */
export function saveGameState(state: any): void {
  try {
    localStorage.setItem('aiOrchestrator_saveGame', JSON.stringify({
      projects: state.projects,
      activeProjectId: state.projects.activeProjectId,
    }));
  } catch (error) {
    console.error('Error saving game:', error);
  }
}

/**
 * Loads the game state from localStorage
 */
export function loadGameState(): any | null {
  try {
    const savedData = localStorage.getItem('aiOrchestrator_saveGame');
    if (!savedData) return null;
    
    return JSON.parse(savedData);
  } catch (error) {
    console.error('Error loading game:', error);
    return null;
  }
}

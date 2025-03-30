import React, { useState, useEffect } from 'react';
import { formatTime } from '../../utils/helpers';

interface ProjectTimerProps {
  startTime: number;
  isActive: boolean;
}

const ProjectTimer: React.FC<ProjectTimerProps> = ({ startTime, isActive }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    if (!startTime) return;
    
    // Calculate initial elapsed time
    setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    
    // Set up interval to update timer
    const intervalId = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [startTime]);
  
  // Format based on how much time has passed
  const getTimerColor = () => {
    if (elapsedTime < 60) return 'text-green-400'; // < 1 minute
    if (elapsedTime < 180) return 'text-yellow-400'; // < 3 minutes
    return 'text-red-400'; // >= 3 minutes
  };
  
  if (!startTime) return null;
  
  return (
    <div className={`project-timer flex items-center ${getTimerColor()}`}>
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
    </div>
  );
};

export default ProjectTimer;

import { useState, useEffect, useCallback } from 'react';

export default function useBoredomDetection({ timeout = 60000, onBoredomDetected, isActive }) {
  const [lastActivity, setLastActivity] = useState(Date.now());

  const resetActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    
    // Add listeners to window
    events.forEach(event => window.addEventListener(event, resetActivity));
    
    // Check interval
    const interval = setInterval(() => {
        const now = Date.now();
        if (now - lastActivity > timeout) {
            if (onBoredomDetected) onBoredomDetected();
            // Reset to avoid spamming
            setLastActivity(Date.now()); 
        }
    }, 5000);

    return () => {
        events.forEach(event => window.removeEventListener(event, resetActivity));
        clearInterval(interval);
    };
  }, [isActive, lastActivity, timeout, onBoredomDetected, resetActivity]);
  
  return null; // Hook usage only
}

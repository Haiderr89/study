import { useState, useEffect, useRef, useCallback } from 'react';

export default function useTimer({ initialTime, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  
  const reset = useCallback((newTime) => {
    setIsRunning(false);
    setTimeLeft(newTime);
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                clearInterval(timerRef.current);
                setIsRunning(false);
                if (onExpire) onExpire();
                return 0;
            }
            return prev - 1;
        });
      }, 1000);
    } else {
        clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, onExpire]);

  // Format time as MM:SS
  const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;
  
  const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

  return { timeLeft, formattedTime, isRunning, start, pause, reset, progress };
}

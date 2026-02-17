import { useState, useEffect, useRef, useCallback } from 'react';

export default function useTimer({ initialTime, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const startTimestampRef = useRef(null);
  const baseTimeRef = useRef(initialTime);

  const start = useCallback(() => {
    if (!isRunning) {
      startTimestampRef.current = Date.now();
      baseTimeRef.current = timeLeft;
      setIsRunning(true);
    }
  }, [isRunning, timeLeft]);

  const pause = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      const now = Date.now();
      const elapsed = Math.floor((now - startTimestampRef.current) / 1000);
      setTimeLeft(Math.max(0, baseTimeRef.current - elapsed));
      startTimestampRef.current = null;
    }
  }, [isRunning]);

  const reset = useCallback((newTime) => {
    setIsRunning(false);
    setTimeLeft(newTime);
    baseTimeRef.current = newTime;
    startTimestampRef.current = null;
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimestampRef.current) / 1000);
        const nextTimeLeft = Math.max(0, baseTimeRef.current - elapsed);

        setTimeLeft(nextTimeLeft);

        if (nextTimeLeft <= 0) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          if (onExpire) onExpire();
        }
      }, 500);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, onExpire]);

  // Format time as MM:SS
  const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

  return { timeLeft, formattedTime, isRunning, start, pause, reset, progress };
}

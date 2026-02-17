import { useState, useEffect, useRef, useCallback } from 'react';

export default function useTimer({ initialTime, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const startTimestampRef = useRef(null);
  const baseTimeRef = useRef(initialTime);
  const timeLeftRef = useRef(initialTime);
  const isRunningRef = useRef(false);

  const updateTime = useCallback((newTime) => {
    const clampedTime = Math.max(0, newTime);
    timeLeftRef.current = clampedTime;
    setTimeLeft(clampedTime);
    return clampedTime;
  }, []);

  const start = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      setIsRunning(true);
      startTimestampRef.current = Date.now();
      baseTimeRef.current = timeLeftRef.current;
    }
  }, []);

  const pause = useCallback(() => {
    if (isRunningRef.current) {
      isRunningRef.current = false;
      setIsRunning(false);
      const now = Date.now();
      const elapsed = Math.floor((now - startTimestampRef.current) / 1000);
      updateTime(baseTimeRef.current - elapsed);
      startTimestampRef.current = null;
    }
  }, [updateTime]);

  const reset = useCallback((newTime) => {
    isRunningRef.current = false;
    setIsRunning(false);
    updateTime(newTime);
    baseTimeRef.current = newTime;
    startTimestampRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
  }, [updateTime]);

  useEffect(() => {
    const tick = () => {
      if (isRunningRef.current) {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimestampRef.current) / 1000);
        const nextTimeLeft = updateTime(baseTimeRef.current - elapsed);

        if (nextTimeLeft <= 0) {
          isRunningRef.current = false;
          setIsRunning(false);
          clearInterval(timerRef.current);
          if (onExpire) onExpire();
        }
      }
    };

    if (isRunning) {
      timerRef.current = setInterval(tick, 500);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, onExpire, updateTime]);

  // Format time as MM:SS
  const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

  return { timeLeft, formattedTime, isRunning, start, pause, reset, progress };
}

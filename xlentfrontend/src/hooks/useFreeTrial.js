import { useEffect, useState, useRef } from 'react';

export const useFreeTrial = () => {
  const [trialExpired, setTrialExpired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const intervalRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Don't re-initialize if already running
    if (initializedRef.current) return;
    
    const isAuthenticated = localStorage.getItem('xlent_token');
    if (isAuthenticated) {
      initializedRef.current = true;
      return;
    }

    initializedRef.current = true;

    // Get first visit time from localStorage
    let firstVisitTime = localStorage.getItem('xlent_first_visit');
    
    if (!firstVisitTime) {
      // First visit, set the timestamp
      firstVisitTime = Date.now().toString();
      localStorage.setItem('xlent_first_visit', firstVisitTime);
    }

    const firstVisitMs = parseInt(firstVisitTime);

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - firstVisitMs) / 1000; // seconds
      const remaining = Math.max(0, 600 - elapsed); // 10 minutes = 600 seconds
      
      setTimeRemaining(Math.ceil(remaining));

      if (remaining <= 0) {
        setTrialExpired(true);
        clearInterval(intervalRef.current);
      }
    }, 1000); // Update every second

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { trialExpired, timeRemaining };
};

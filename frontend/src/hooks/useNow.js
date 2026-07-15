import { useEffect, useState } from 'react';

// Hook that returns current Date and updates periodically so "Today" labels stay accurate
export default function useNow(updateIntervalMs = 30000) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), updateIntervalMs);
    return () => clearInterval(id);
  }, [updateIntervalMs]);

  return now;
}

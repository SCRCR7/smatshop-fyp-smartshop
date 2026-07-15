import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FlashSaleTimer = ({ children }) => {
  const [flashSale, setFlashSale] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const fetchFlashSale = async () => {
      const res = await axios.get('/api/flash-sale');
      setFlashSale(res.data);
      setNow(Date.now());
    };
    fetchFlashSale();
    const id = setInterval(() => setNow(Date.now()), 1000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, []);

  if (!flashSale) return null;
  const { isActive, startTime, endTime, status } = flashSale;
  if (!isActive || status === 'expired') return null;

  let countdownTo = status === 'upcoming' ? new Date(startTime) : new Date(endTime);
  let diff = Math.max(0, Math.floor((countdownTo - now) / 1000));
  const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
  const seconds = String(diff % 60).padStart(2, '0');

  let label = status === 'upcoming' ? 'Sale starts in' : 'Ending in';
  if (diff === 0 && status === 'upcoming') return null;
  if (diff === 0 && status === 'active') return null;

  return children({
    label,
    hours,
    minutes,
    seconds,
    status,
    isActive,
  });
};

export default FlashSaleTimer;

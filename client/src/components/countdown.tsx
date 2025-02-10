import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    function calculateTimeLeft() {
      const now = new Date();
      const targetTime = new Date(targetDate).getTime();
      const currentTime = now.getTime();
      const difference = targetTime - currentTime;

      if (difference <= 0) {
        return "Released";
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const parts = [];

      if (days > 0) parts.push(`${days}j`);
      parts.push(hours.toString().padStart(2, '0'));
      parts.push(minutes.toString().padStart(2, '0'));
      parts.push(seconds.toString().padStart(2, '0'));

      return parts.join(':');
    }

    function updateCountdown() {
      setTimeLeft(calculateTimeLeft());
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="font-mono text-3xl sm:text-5xl font-bold text-newbalance">
      {timeLeft || "Chargement..."}
    </div>
  );
}
import { useEffect, useState } from "react";
import { differenceInSeconds, format } from "date-fns";

interface CountdownProps {
  targetDate: Date;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const diffInSeconds = differenceInSeconds(new Date(targetDate), now);
      
      if (diffInSeconds <= 0) {
        setTimeLeft("Released");
        return;
      }

      const days = Math.floor(diffInSeconds / (24 * 60 * 60));
      const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
      const seconds = Math.floor(diffInSeconds % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="text-2xl font-mono font-bold text-primary">
      {timeLeft}
    </div>
  );
}

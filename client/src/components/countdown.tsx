import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function updateCountdown() {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const diffInMs = target - now;

      if (diffInMs <= 0) {
        setTimeLeft("Released");
        return;
      }

      const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');

      if (days > 0) {
        setTimeLeft(`${days}j ${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`);
      } else {
        setTimeLeft(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
      }
    }

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="text-3xl sm:text-5xl font-mono font-bold text-newbalance-dark">
      {timeLeft}
    </div>
  );
}
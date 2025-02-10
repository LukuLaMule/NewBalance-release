import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

interface CountdownProps {
  targetDate: Date;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function updateCountdown() {
      try {
        const now = new Date();
        const target = new Date(targetDate);

        if (isNaN(target.getTime())) {
          console.error("Invalid target date");
          setTimeLeft("Date invalide");
          return;
        }

        const diffInSeconds = differenceInSeconds(target, now);

        if (diffInSeconds <= 0) {
          setTimeLeft("Released");
          return;
        }

        const days = Math.floor(diffInSeconds / (24 * 60 * 60));
        const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
        const seconds = Math.floor(diffInSeconds % 60);

        if (days > 0) {
          setTimeLeft(`${days}j ${hours}h ${minutes}m ${seconds}s`);
        } else {
          const formattedHours = hours.toString().padStart(2, '0');
          const formattedMinutes = minutes.toString().padStart(2, '0');
          const formattedSeconds = seconds.toString().padStart(2, '0');
          setTimeLeft(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
        }
      } catch (error) {
        console.error("Error in countdown:", error);
        setTimeLeft("Erreur");
      }
    }

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="text-3xl sm:text-5xl font-mono font-bold text-primary">
      {timeLeft}
    </div>
  );
}
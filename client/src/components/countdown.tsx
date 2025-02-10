import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date;
}

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("Chargement...");

  useEffect(() => {
    function formatNumber(n: number): string {
      return n.toString().padStart(2, '0');
    }

    function updateCountdown() {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Released");
        return;
      }

      const days = Math.floor(diff / MS_PER_DAY);
      const hours = Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR);
      const minutes = Math.floor((diff % MS_PER_HOUR) / MS_PER_MINUTE);
      const seconds = Math.floor((diff % MS_PER_MINUTE) / MS_PER_SECOND);

      setTimeLeft(
        days > 0
          ? `${days}j ${formatNumber(hours)}h ${formatNumber(minutes)}m ${formatNumber(seconds)}s`
          : `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`
      );
    }

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="font-mono font-bold text-3xl sm:text-5xl text-newbalance-dark">
      {timeLeft}
    </div>
  );
}
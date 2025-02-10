import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { motion } from "framer-motion";

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

      if (days > 0) {
        setTimeLeft(`${days}j ${hours}h ${minutes}m ${seconds}s`);
      } else {
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        setTimeLeft(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
      }
    }

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <motion.div 
      className="text-3xl sm:text-5xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 0.5
      }}
    >
      {timeLeft}
    </motion.div>
  );
}
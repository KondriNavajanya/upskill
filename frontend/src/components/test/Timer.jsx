import { useEffect, useState } from "react";

const Timer = ({ seconds = 900, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return undefined;
    }

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white dark:bg-accent-600">
      {minutes}:{secs}
    </div>
  );
};

export default Timer;

import { useEffect, useState } from "react";

const Timer = ({ duration, type, submit }) => {
  const timeLocal = parseInt(localStorage.getItem("time_limit")) - Date.now();
  const [time, setTime] = useState(timeLocal || duration);

  useEffect(() => {
    let timer;

    if (time <= 0) {
      submit();
    }

    if (type == "up") {
      timer = setTimeout(() => {
        setTime(time + 1000);
      }, 1000);
    } else {
      timer = setTimeout(() => {
        setTime(time - 1000);
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [time]);

  const getFormattedTime = (miliseconds) => {
    let total_seconds = parseInt(Math.floor(miliseconds / 1000));
    let total_minutes = parseInt(Math.floor(total_seconds / 60));

    let seconds = parseInt(total_seconds % 60);
    seconds = seconds > 9 ? seconds : "0" + seconds;
    let minutes = parseInt(total_minutes % 60);
    minutes = minutes > 9 ? minutes : "0" + minutes;

    return `${minutes}:${seconds}`;
  };

  return getFormattedTime(time);
};

export default Timer;

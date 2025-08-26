import React, { useEffect, useState } from "react";

const Timer = ({ duration, type }) => {
  const [time, setTime] = useState(duration);
  useEffect(() => {
    let timer;

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
    let minutes = parseInt(total_minutes % 60);

    return `${minutes}:${seconds}`;
  };

  return getFormattedTime(time);
};

export default Timer;

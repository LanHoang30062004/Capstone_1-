import React from "react";
import CountUp from "react-countup";
import "./Stats.scss";

const statsData = [
  { value: 4000, suffix: "+", label: "Từ kí hiệu" },
  { value: 95, suffix: "%", label: "Độ chính xác AI" },
  { value: 4000, suffix: "+", label: "Video học" },
  { value: 200, suffix: "+", label: "Ngân hàng câu hỏi" },
];

const Stats = () => {
  return (
    <section className="stats">
      <div className="container">
        <div className="stats__inner">
          {statsData.map((item, index) => (
            <div className="stats__item" key={index}>
              <div className="stats__value">
                <CountUp
                  end={item.value}
                  duration={2}
                  suffix={item.suffix}
                  enableScrollSpy
                  scrollSpyOnce
                />
              </div>
              <div className="stats__label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

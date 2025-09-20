import React from "react";
import "./Status.css";

const Status = ({ status, className }) => {
  return <div className={className}>{status}</div>;
};

export default Status;

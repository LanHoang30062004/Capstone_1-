import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginGoogle = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = searchParams.get("token");
    localStorage.setItem("accessToken", access_token);
    navigate("/");
  }, [searchParams, navigate]);
  return <div>LoginGoogle</div>;
};

export default LoginGoogle;

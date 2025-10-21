import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginGoogle = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  console.log(searchParams.get("token"));

  console.log();
  useEffect(() => {
    const access_token = searchParams.get("token");
    localStorage.setItem("accessToken", access_token);
    navigate("/");
  }, [searchParams, navigate]);
  return <div>LoginGoogle</div>;
};

export default LoginGoogle;

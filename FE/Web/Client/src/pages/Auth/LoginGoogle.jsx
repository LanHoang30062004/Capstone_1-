import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getUser } from "~/service/userService";

const LoginGoogle = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const access_token = searchParams.get("token");
      localStorage.setItem("accessToken", access_token);
      const decoded = jwtDecode(access_token);

      const user = await getUser({
        email: decoded.email,
      });

      localStorage.setItem("userInfo", JSON.stringify(user.data));
      navigate("/");
    };

    fetchUserData();
  }, [searchParams, navigate]);
  return <div>LoginGoogle</div>;
};

export default LoginGoogle;

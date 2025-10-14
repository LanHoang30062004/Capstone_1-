import { Outlet } from "react-router-dom";

const Auth = () => {
  return (
    <>
      <div className="auth">
        <div className="auth__container">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Auth;

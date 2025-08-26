import React from "react";
import { Outlet } from "react-router-dom";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";

const LayoutDefault = () => {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default LayoutDefault;

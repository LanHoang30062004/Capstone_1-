import React from "react";
import { useRoutes } from "react-router-dom";
import route from "~/routes/route";

const AllRoute = () => {
  const element = useRoutes(route);

  return <>{element}</>;
};

export default AllRoute;

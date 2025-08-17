import React from "react";
import { useRoutes } from "react-router-dom";
import routes from "~/routes";

const AllRoute = () => {
  const element = useRoutes(routes);
  return <>{element}</>;
};

export default AllRoute;

import Sider from "antd/es/layout/Sider";
import React, { useContext } from "react";
import Logo from "~/assets/images/Logo.png";
import { MdOutlineTopic } from "react-icons/md";
import { Menu, Segmented } from "antd";
import "./Siderbar.scss";
import { Link } from "react-router-dom";
import {
  SunOutlined,
  MoonOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import { ThemeContext } from "~/context/themeContext";
import { UserSwitchOutlined } from "@ant-design/icons";
import { permissions, roles } from "~/configs/rbacConfig";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import usePermission from "~/hooks/usePermission";

const getItems = (hasPermission) => {
  return [
    // hasPermission(permissions.VIEW_EMPLOYEE) && {
    //   key: "employee",
    //   icon: <MdOutlineTopic />,
    //   label: <Link to="/employee">Chủ đề</Link>,
    // },

    {
      key: "employee",
      icon: <MdOutlineTopic />,
      label: <Link to="/employee">Chủ đề</Link>,
    },

    {
      key: "word",
      icon: <MdOutlineTopic />,
      label: <Link to="/word">Kí hiệu</Link>,
    },

    {
      key: "flash-card",
      icon: <MdOutlineTopic />,
      label: <Link to="/flash-card">Flash card</Link>,
    },
  ];
};

const Sidebar = () => {
  const { myTheme, toggleTheme } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = userInfo?.role || roles.EMPLOYEE;

  const { hasPermission } = usePermission(userRole);

  const handleChange = (value) => {
    toggleTheme(value);
  };

  const items = getItems(hasPermission);

  return (
    <>
      <Sider theme="light" className="sidebar">
        <div className="sidebar__logo">
          <img src={Logo} alt="Logo" width={60} />
        </div>

        <Menu
          defaultSelectedKeys={[location.pathname.split("/")[1] || "dashboard"]}
          mode="inline"
          theme="light"
          items={items}
        />

        <Segmented
          size="large"
          options={[
            { label: "Sáng", value: "light", icon: <SunOutlined /> },
            { label: "Tối", value: "dark", icon: <MoonOutlined /> },
          ]}
          onChange={handleChange}
          style={{ margin: "auto 10px 10px 10px" }}
          defaultValue={myTheme}
        />
      </Sider>
    </>
  );
};

export default Sidebar;

import { Avatar, Badge, Dropdown, Flex } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { NotificationIcon } from "~/components/CustomeIcon/CustomeIcon";
import {
  DownOutlined,
  LogoutOutlined,
  UserOutlined,
  WarningOutlined,
  MessageOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import "./Header.css";
import { Link } from "react-router-dom";
import accountService from "~/services/accountService";
import { ThemeContext } from "~/context/ThemeContext";

const items = [
  {
    key: "account-info",
    label: <Link to="/user/info">Thông tin cá nhân</Link>,
    icon: <UserOutlined />,
  },

  {
    key: "logout",
    label: <div onClick={() => accountService.logout()}>Đăng xuất</div>,
    icon: <LogoutOutlined />,
  },
];

const Header = (props) => {
  const { title, subTitle } = props;
  const [notification, setNotification] = useState([]);
  const { myTheme } = useContext(ThemeContext);

  const notificationItems = notification?.map((item) => ({
    key: item,
    label: (
      <div className="dropdown__notification--item">
        <div className="dropdown__notification--icon">
          {item.includes("Cảnh báo") ? (
            <div className="dropdown__notification--icon warning">
              <WarningOutlined className="icon" />
            </div>
          ) : item.includes("Lương") ? (
            <div className="dropdown__notification--icon message">
              <MessageOutlined className="icon" />
            </div>
          ) : (
            <div className="dropdown__notification--icon sucess">
              <DollarOutlined className="icon" />
            </div>
          )}
        </div>

        <div className="dropdown__notification--content">
          <p className="dropdown__notification--title">{item}</p>
        </div>
      </div>
    ),
  }));

  // useEffect(() => {
  //   const fetchNotification = async () => {
  //     const response = await accountService.getNotification();
  //     const notification = response?.notification?.split("|");
  //     if (notification.length > 0) {
  //       setNotification(notification);
  //     }
  //   };

  //   fetchNotification();
  // }, []);

  return (
    <>
      <div className="header">
        <Flex align="center" justify="space-between">
          <div className="header__left">
            <p className="header__title">{title}</p>
            <p className="header__title--sub">{subTitle}</p>
          </div>

          <div className="header__right">
            <Dropdown menu={{ items }}>
              <div menu={{ items }} className="header__account">
                <Avatar
                  src="https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png"
                  className="header__account--avatar"
                  shape="square"
                  size={40}
                />
                <div className="header__account--info">
                  <p className="header__account--name">Long</p>
                  <p className="header__account--role">admin</p>
                </div>
                <DownOutlined />
              </div>
            </Dropdown>
          </div>
        </Flex>
      </div>
    </>
  );
};

export default Header;

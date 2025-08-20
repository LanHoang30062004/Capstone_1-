import { Drawer, Flex } from "antd";
import { Link } from "react-router-dom";
import Logo from "~/assets/images/Logo.png";
import { IoMdMenu } from "react-icons/io";
import "./Header.scss";
import { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header__inner">
            <nav className="header__nav">
              <Flex align="center" justify="space-between">
                <div className="header__left">
                  <img src={Logo} alt="Logo" />
                </div>

                <div className="header__right">
                  <Flex align="center" gap={26}>
                    <div className="header__link">
                      <Flex align="center">
                        <Link to="/" className="header__link--item">
                          Trang chủ
                        </Link>

                        <Link to="/" className="header__link--item">
                          Giới thiệu
                        </Link>

                        <Link to="/dictionary" className="header__link--item">
                          Từ điển
                        </Link>

                        <Link to="/learn" className="header__link--item">
                          Học
                        </Link>

                        <Link to="/practise" className="header__link--item">
                          Củng cố kiến thức
                        </Link>
                      </Flex>
                    </div>

                    <div className="header__btn">
                      <Flex align="center" gap={26}>
                        <IoMdMenu
                          className="header__icon"
                          onClick={showDrawer}
                        />

                        <button className="header__btn--login btn">
                          Đăng nhập
                        </button>

                        <button className="header__btn--register btn">
                          Đăng ký
                        </button>
                      </Flex>
                    </div>
                  </Flex>
                </div>
              </Flex>
            </nav>
          </div>
        </div>

        <Drawer className="custome-drawer" onClose={onClose} open={open}>
          <Flex align="center" vertical gap={40}>
            <Link to="/" className="header__link--item">
              Trang chủ
            </Link>

            <Link to="/" className="header__link--item">
              Giới thiệu
            </Link>

            <Link to="/dictionary" className="header__link--item">
              Từ điển
            </Link>

            <Link to="/learn" className="header__link--item">
              Học
            </Link>

            <Link to="/practise" className="header__link--item">
              Củng cố kiến thức
            </Link>
          </Flex>
        </Drawer>
      </header>
    </>
  );
};

export default Header;

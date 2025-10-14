import { Drawer, Flex } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Logo from "~/assets/images/Logo.png";
import { IoMdMenu } from "react-icons/io";
import "./Header.scss";
import { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const user = localStorage.getItem("accessToken");

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

                      <Link to="/dictionary" className="header__link--item">
                        Từ điển
                      </Link>

                      <Link to="/lesson" className="header__link--item">
                        FlashCard
                      </Link>

                      <Link to="/practise" className="header__link--item">
                        Làm bài test
                      </Link>
                    </Flex>
                  </div>

                  <div className="header__btn">
                    <Flex align="center" gap={26}>
                      <IoMdMenu className="header__icon" onClick={showDrawer} />

                      {user ? (
                        <button
                          className="header__btn--logout btn"
                          onClick={handleLogout}
                        >
                          Đăng xuất
                        </button>
                      ) : (
                        <>
                          <Link to="/login">
                            <button className="header__btn--login btn">
                              Đăng nhập
                            </button>
                          </Link>

                          <Link to="/register">
                            <button className="header__btn--register btn">
                              Đăng ký
                            </button>
                          </Link>
                        </>
                      )}
                    </Flex>
                  </div>
                </Flex>
              </div>
            </nav>
          </div>
        </div>

        <Drawer className="custome-drawer" onClose={onClose} open={open}>
          <Flex align="center" vertical gap={40}>
            <Link to="/" className="header__link--item">
              Trang chủ
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

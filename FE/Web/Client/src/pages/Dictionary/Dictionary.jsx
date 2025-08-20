import { Button, Form, Input, Pagination } from "antd";
import Background from "~/assets/images/Bg2.png";
import { FaPlay } from "react-icons/fa";
import "./Dictionary.scss";
import { CiSearch } from "react-icons/ci";

const Dictionary = () => {
  const handleSearch = (value) => {
    console.log(value);
  };

  return (
    <>
      <section className="dictionary">
        <div className="container">
          <div className="dictionary__inner">
            <h1 className="dictionary__title">Ngôn ngữ kí hiệu</h1>

            <Form onFinish={handleSearch}>
              <Form.Item name="search">
                <Input
                  size="large"
                  placeholder="Tìm kiếm..."
                  prefix={<CiSearch />}
                  style={{ maxWidth: "500px" }}
                />
              </Form.Item>
            </Form>

            <div className="dictionary__grid">
              <div className="dictionary__card card">
                <div className="dictionary__card--video">
                  <img src={Background} alt="Background" />

                  <div className="dictionary__card--play">
                    <FaPlay className="dictionary__card--icon" />
                  </div>
                </div>

                <div className="dictionary__card--content">
                  <h3 className="dictionary__card--title">Địa chỉ</h3>

                  <Button type="primary">Phân tích</Button>
                </div>
              </div>

              <div className="dictionary__card card">
                <div className="dictionary__card--video">
                  <img src={Background} alt="Background" />

                  <div className="dictionary__card--play">
                    <FaPlay className="dictionary__card--icon" />
                  </div>
                </div>

                <div className="dictionary__card--content">
                  <h3 className="dictionary__card--title">Địa chỉ</h3>

                  <Button type="primary">Phân tích</Button>
                </div>
              </div>

              <div className="dictionary__card card">
                <div className="dictionary__card--video">
                  <img src={Background} alt="Background" />

                  <div className="dictionary__card--play">
                    <FaPlay className="dictionary__card--icon" />
                  </div>
                </div>

                <div className="dictionary__card--content">
                  <h3 className="dictionary__card--title">Địa chỉ</h3>

                  <Button type="primary">Phân tích</Button>
                </div>
              </div>

              <div className="dictionary__card card">
                <div className="dictionary__card--video">
                  <img src={Background} alt="Background" />

                  <div className="dictionary__card--play">
                    <FaPlay className="dictionary__card--icon" />
                  </div>
                </div>

                <div className="dictionary__card--content">
                  <h3 className="dictionary__card--title">Địa chỉ</h3>

                  <Button type="primary">Phân tích</Button>
                </div>
              </div>
            </div>

            <Pagination
              className="dictionary__pagination"
              align="center"
              defaultCurrent={1}
              total={50}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dictionary;

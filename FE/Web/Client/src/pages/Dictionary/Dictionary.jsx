import { Button, Col, Form, Input, Pagination, Row, Skeleton } from "antd";
import Background from "~/assets/images/Bg2.png";
import { FaPlay } from "react-icons/fa";
import "./Dictionary.scss";
import { CiSearch } from "react-icons/ci";
import DictionaryModal from "./DictionaryModal";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getWords } from "~/service/wordService";

const Dictionary = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [words, setWords] = useState(null);
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(false);

  const hanldeOpenModal = (setOpen, word) => {
    setOpen(true);
    setWord(word);
  };

  const handleSearch = (value) => {
    const searchObject = Object.fromEntries(searchParams.entries());
    if (!searchObject.size) searchObject.size = 10;

    setSearchParams({
      ...searchObject,
      page: 1,
      search: value.search.trim(),
    });
  };

  const handleChangePage = (page, pageSize) => {
    const searchObject = Object.fromEntries(searchParams.entries());
    setSearchParams({
      ...searchObject,
      page: page,
      size: pageSize,
    });
  };

  useEffect(() => {
    const searchObject = Object.fromEntries(searchParams.entries());

    if (Object.keys(searchObject).length === 0) {
      searchObject.page = 1;
      searchObject.size = 10;
    }

    searchObject.page = parseInt(searchObject.page);
    searchObject.size = parseInt(searchObject.size);

    const fetchWord = async () => {
      try {
        setLoading(true);
        const response = await getWords(searchObject);
        setWords(response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [searchParams]);

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
              {loading
                ? // Render skeleton khi loading
                  Array.from({ length: 6 }).map((_, i) => (
                    <div className="dictionary__card card" key={i}>
                      <Skeleton.Image
                        style={{ width: "100%", height: 150 }}
                        active
                      />
                      <Skeleton active title={false} paragraph={{ rows: 1 }} />
                    </div>
                  ))
                : words?.items?.map((word) => (
                    <div className="dictionary__card card" key={word.wordId}>
                      <div
                        className="dictionary__card--video"
                        onClick={() => hanldeOpenModal(setIsModalOpen, word)}
                      >
                        <video src={word.videoUrl} />
                        <div className="dictionary__card--play">
                          <FaPlay className="dictionary__card--icon" />
                        </div>
                      </div>
                      <div className="dictionary__card--content">
                        <h3 className="dictionary__card--title">
                          {word?.wordName}
                        </h3>
                      </div>
                    </div>
                  ))}
            </div>

            {!loading && (
              <Pagination
                className="dictionary__pagination"
                align="center"
                current={parseInt(searchParams.get("page")) || 1}
                total={words?.totalPages * words?.pageSize}
                onChange={handleChangePage}
                pageSize={words?.pageSize || 10}
                pageSizeOptions={[5, 10, 20, 50]}
              />
            )}
          </div>

          <DictionaryModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            word={word}
          />
        </div>
      </section>
    </>
  );
};

export default Dictionary;

import { Button, Card, List, Popconfirm, Space, Tag } from "antd";
import React, { useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Header from "~/components/Header/Header";
import {
  deleteTopic,
  fetchTopicDetail,
  fetchTopicEdit,
} from "~/redux/topic/topicSlice";

const TopicDetail = () => {
  const topic = useSelector((state) => state.topic.topicDetail);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchTopicDetail(id));
  }, [id, dispatch]);

  return (
    <>
      <div className="topic__detail contain">
        <Header title="Chi tiết bài test" subTitle="Danh sách câu hỏi" />
        <div className="topic__detail--title">
          <Space>
            <h2>Test: {topic?.content}</h2>
            <Button
              type="primary"
              onClick={() => navigate(`/topic/edit/${topic?.id}`)}
            >
              Chỉnh sửa
            </Button>
          </Space>
        </div>

        <Space direction="vertical" className="topic__detail--info">
          <p>Thời gian: {topic?.durationMinutes} phút</p>
          <p>Tổng số câu hỏi: {topic?.questions.length}</p>
        </Space>

        {topic?.questions.map((q, qIndex) => (
          <Card
            key={q.id}
            title={`Câu hỏi ${qIndex + 1}`}
            style={{ marginBottom: 20 }}
          >
            <video src={q.questionUrl} width={300} autoPlay loop />

            <List
              dataSource={q.options}
              renderItem={(opt, optIndex) => (
                <List.Item>
                  <span>{opt.option}</span>
                  {opt.correct && (
                    <Tag color="green" style={{ marginLeft: 8 }}>
                      Đáp án đúng
                    </Tag>
                  )}
                </List.Item>
              )}
            />

            {/* <div className="question__delete">
              <Popconfirm
                title="Xoá câu hỏi này"
                description="Bạn có chắc muốn xoá câu hỏi  này?"
                onConfirm={() => handleDelete(q.id)}
                okText="Xoá"
                cancelText="Huỷ"
              >
                <RiDeleteBin6Line className="icon" />
              </Popconfirm>
            </div> */}
          </Card>
        ))}
      </div>
    </>
  );
};

export default TopicDetail;

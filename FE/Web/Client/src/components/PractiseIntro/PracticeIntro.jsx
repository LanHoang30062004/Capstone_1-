import { FaBook, FaEye, FaComments } from "react-icons/fa";
import "./PracticeIntro.scss";

export default function PracticeIntro() {
  return (
    <section className="practice-intro">
      <div className="container">
        <div className="practice-intro__inner">
          <div className="practice-intro__head">
            <h2 className="practice-intro__title">
              Luyện tập với <span>Ngân hàng câu hỏi</span>
            </h2>
            <p className="practice-intro__description">
              SignSmart cung cấp nhiều bài luyện tập trắc nghiệm giúp bạn ôn
              tập, ghi nhớ và kiểm tra kiến thức ngôn ngữ ký hiệu đã học.
            </p>
          </div>

          <div className="practice-intro__body">
            <div className="practice-intro__card">
              <div className="practice-intro__icon practice-intro__icon--one">
                <FaBook />
              </div>

              <h3 className="practice-intro__card--title">
                Luyện tập từ vựng &amp; câu ký hiệu
              </h3>

              <p className="practice-intro__card--description">
                Ôn tập các ký hiệu đã học qua bài trắc nghiệm video. Hệ thống
                chấm điểm và phản hồi ngay lập tức.
              </p>
            </div>

            <div className="practice-intro__card">
              <div className="practice-intro__icon practice-intro__icon--two">
                <FaEye />
              </div>

              <h3 className="practice-intro__card--title">
                Kiểm tra kỹ năng nhận diện ký hiệu
              </h3>

              <p className="practice-intro__card--description">
                Làm các bài tập nhận diện ký hiệu từ video hoặc hình ảnh, giúp
                tăng phản xạ và khả năng ghi nhớ.
              </p>
            </div>

            <div className="practice-intro__card">
              <div className="practice-intro__icon practice-intro__icon--three">
                <FaComments />
              </div>

              <h3 className="practice-intro__card--title">
                Flashcard ghi nhớ ký hiệu
              </h3>

              <p className="practice-intro__card--description">
                Học và ghi nhớ các ký hiệu thông qua flashcard trực quan, giúp
                nhận diện nhanh ý nghĩa và cách sử dụng ký hiệu trong ngữ cảnh
                thực tế.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

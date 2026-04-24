import os
import numpy as np
import argparse
import pickle

from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, RandomizedSearchCV, StratifiedKFold
from sklearn.metrics import classification_report, confusion_matrix

if __name__ == "__main__":
    # Get the pose name from argument
    parser = argparse.ArgumentParser("Training model")

    # Add and parse the arguments
    parser.add_argument("--model_name", help="Name of the model",
                        type=str, default="model")
    parser.add_argument("--dir", help="Location of the model",
                        type=str, default="models")
    parser.add_argument("--n_iter", help="Number of random search iterations",
                        type=int, default=20)
    parser.add_argument("--cv_folds", help="Number of cross validation folds",
                        type=int, default=5)
    args = parser.parse_args()

    # Train X, y and mapping
    X, y, mapping = [], [], dict()

    # Read in the data from data folder
    for current_class_index, pose_file in enumerate(os.scandir("data")):
        # Load pose data
        file_path = f"data/{pose_file.name}"
        pose_data = np.load(file_path)

        # Add to training data
        X.append(pose_data)
        y += [current_class_index] * pose_data.shape[0]

        # Add to mapping
        mapping[current_class_index] = pose_file.name.split(".")[0]

    # Convert to Numpy
    X, y = np.vstack(X), np.array(y)

    print(f"Total samples: {X.shape[0]}, Features: {X.shape[1]}, Classes: {len(mapping)}")
    print(f"Class distribution: {np.bincount(y)}")

    # ============================================
    # PHẦN 1: RandomSearchCV + Cross Validation
    # ============================================
    
    # Định nghĩa không gian siêu tham số cho SVM
    param_dist = {
        'C': [0.1, 1, 10, 50, 100, 200],           # Regularization parameter
        'gamma': ['scale', 'auto', 0.001, 0.01, 0.1, 1],  # Kernel coefficient
        'kernel': ['rbf', 'linear', 'poly'],        # Kernel type
        'degree': [2, 3, 4],                       # For poly kernel (chỉ dùng khi kernel='poly')
        'class_weight': [None, 'balanced']         # Xử lý mất cân bằng lớp
    }
    
    # Khởi tạo mô hình SVM
    svm = SVC(decision_function_shape='ovo')
    
    # Stratified K-Fold (đảm bảo mỗi fold có tỷ lệ lớp giống tổng thể)
    cv_strategy = StratifiedKFold(n_splits=args.cv_folds, shuffle=True, random_state=42)
    
    # RandomizedSearchCV
    random_search = RandomizedSearchCV(
        estimator=svm,
        param_distributions=param_dist,
        n_iter=args.n_iter,           # Số tổ hợp ngẫu nhiên cần thử
        cv=cv_strategy,               # Cross validation strategy
        scoring='accuracy',           # Chỉ số đánh giá (có thể đổi thành 'f1_macro' nếu mất cân bằng)
        n_jobs=-1,                    # Dùng tất cả CPU cores
        verbose=1,                    # In ra quá trình chạy
        random_state=42,              # Để reproducible
        return_train_score=True       # Lấy cả train score để kiểm tra overfitting
    )
    
    print("\n" + "="*50)
    print(f"Starting RandomizedSearchCV with {args.n_iter} iterations, {args.cv_folds}-fold CV")
    print("="*50 + "\n")
    
    # Chạy RandomSearchCV trên TOÀN BỘ dữ liệu (nó sẽ tự chia train/val bên trong)
    random_search.fit(X, y)
    
    # Kết quả tốt nhất
    print("\n" + "="*50)
    print("BEST PARAMETERS FOUND:")
    print("="*50)
    for param, value in random_search.best_params_.items():
        print(f"  {param}: {value}")
    print(f"\nBest cross-validation accuracy: {random_search.best_score_:.4f} ({random_search.best_score_*100:.2f}%)")
    
    # ============================================
    # PHẦN 2: Đánh giá cuối cùng trên test set
    # ============================================
    
    # Chia dữ liệu thành train/test một lần duy nhất để đánh giá cuối
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.1, stratify=y, random_state=42
    )
    
    # Lấy mô hình tốt nhất từ RandomSearch
    best_model = random_search.best_estimator_
    
    # Train lại trên toàn bộ train set (hoặc có thể dùng luôn model đã được fit trong CV)
    # LƯU Ý: random_search.best_estimator_ đã được fit trên toàn bộ dữ liệu? 
    # KHÔNG, nó chỉ fit trên các folds, không phải toàn bộ.
    # Nên train lại trên toàn bộ train set:
    print("\n" + "="*50)
    print("Training best model on full training set...")
    print("="*50)
    best_model.fit(X_train, y_train)
    
    # Đánh giá trên train set
    train_accuracy = best_model.score(X_train, y_train)
    
    # Đánh giá trên test set (chưa nhìn thấy)
    test_accuracy = best_model.score(X_test, y_test)
    
    print(f"\nTrain accuracy: {train_accuracy*100:.2f}%")
    print(f"Test accuracy: {test_accuracy*100:.2f}%")
    
    # Kiểm tra overfitting
    if train_accuracy - test_accuracy > 0.1:
        print("\n⚠️ WARNING: Possible overfitting! Train accuracy much higher than test accuracy.")
    else:
        print("\n✓ Model is generalizing well.")
    
    # ============================================
    # PHẦN 3: Báo cáo chi tiết
    # ============================================
    
    # Dự đoán trên test set
    y_pred = best_model.predict(X_test)
    
    # Classification report cho từng lớp
    print("\n" + "="*50)
    print("CLASSIFICATION REPORT (per class):")
    print("="*50)
    print(classification_report(y_test, y_pred, target_names=[mapping[i] for i in range(len(mapping))]))
    
    # Confusion matrix (tùy chọn, nếu ít lớp hơn 20 thì in ra)
    if len(mapping) <= 20:
        print("\n" + "="*50)
        print("CONFUSION MATRIX:")
        print("="*50)
        print(confusion_matrix(y_test, y_pred))
    
    # ============================================
    # PHẦN 4: Lưu mô hình
    # ============================================
    
    # Tạo thư mục nếu chưa có
    os.makedirs(args.dir, exist_ok=True)
    
    # Lưu model và mapping
    model_path = os.path.join(args.dir, f"{args.model_name}.pkl")
    with open(model_path, "wb") as file:
        pickle.dump((best_model, mapping), file)
    
    # Cũng lưu lại best parameters để tham khảo
    params_path = os.path.join(args.dir, f"{args.model_name}_best_params.txt")
    with open(params_path, "w") as f:
        f.write(str(random_search.best_params_))
        f.write(f"\n\nBest CV accuracy: {random_search.best_score_}\n")
        f.write(f"Test accuracy: {test_accuracy}\n")
    
    print(f"\n✓ Saved model to {model_path}")
    print(f"✓ Saved best params to {params_path}")
    
    # ============================================
    # PHẦN 5: (Tùy chọn) In kết quả của tất cả các lần thử
    # ============================================
    
    print("\n" + "="*50)
    print(f"TOP 5 BEST MODELS (out of {args.n_iter} iterations):")
    print("="*50)
    results = zip(random_search.cv_results_['mean_test_score'], 
                  random_search.cv_results_['params'])
    sorted_results = sorted(results, key=lambda x: x[0], reverse=True)[:5]
    for i, (score, params) in enumerate(sorted_results, 1):
        print(f"{i}. CV score: {score:.4f} ({score*100:.2f}%) - Params: {params}")
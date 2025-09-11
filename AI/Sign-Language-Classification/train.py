import os
import numpy as np
import argparse
import pickle
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE  # For handling class imbalance

if __name__ == "__main__":
    parser = argparse.ArgumentParser("Training model")
    parser.add_argument("--model_name", type=str, default="model")
    parser.add_argument("--dir", type=str, default="models")
    args = parser.parse_args()

    # Load data
    X, y, mapping = [], [], dict()
    
    for current_class_index, pose_file in enumerate(os.scandir("data")):
        file_path = f"data/{pose_file.name}"
        pose_data = np.load(file_path)
        
        # Check for empty data
        if pose_data.size == 0:
            print(f"Warning: Empty file {pose_file.name}")
            continue
            
        X.append(pose_data)
        y += [current_class_index] * pose_data.shape[0]
        mapping[current_class_index] = pose_file.name.split(".")[0]

    # Convert to numpy
    X, y = np.vstack(X), np.array(y)
    
    # Check data quality
    print(f"Data shape: {X.shape}")
    print(f"Class distribution: {np.bincount(y)}")
    
    # Handle class imbalance if needed
    if len(np.unique(y)) > 1 and np.min(np.bincount(y)) < 10:
        smote = SMOTE()
        X, y = smote.fit_resample(X, y)
    
    # Normalize data
    scaler = StandardScaler()
    X = scaler.fit_transform(X)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )
    
    # Hyperparameter tuning
    param_grid = {
        'C': [0.1, 1, 10, 100],
        'gamma': ['scale', 'auto', 0.1, 0.01],
        'kernel': ['rbf', 'linear']
    }
    
    grid_search = GridSearchCV(
        SVC(decision_function_shape='ovo'),
        param_grid,
        cv=5,
        scoring='accuracy',
        n_jobs=-1
    )
    
    grid_search.fit(X_train, y_train)
    
    # Best model
    best_model = grid_search.best_estimator_
    
    # Cross-validation
    cv_scores = cross_val_score(best_model, X_train, y_train, cv=5)
    
    # Evaluation
    y_pred = best_model.predict(X_test)
    
    print(f"Best parameters: {grid_search.best_params_}")
    print(f"CV Accuracy: {np.mean(cv_scores):.3f} ± {np.std(cv_scores):.3f}")
    print(f"Test Accuracy: {best_model.score(X_test, y_test):.3f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=list(mapping.values())))
    
    # Save model and scaler
    model_path = os.path.join(args.dir, f"{args.model_name}.pkl")
    with open(model_path, "wb") as file:
        pickle.dump((best_model, scaler, mapping), file)
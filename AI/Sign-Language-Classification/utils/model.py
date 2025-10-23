import pickle
import numpy as np
from sklearn.base import BaseEstimator

class ASLClassificationModel:
    @staticmethod
    def load_model(model_path):
        # Load model, mapping, scaler, và pca từ pickle
        with open(model_path, "rb") as file:
            model, mapping, scaler, pca = pickle.load(file)

        if not isinstance(model, BaseEstimator):
            raise TypeError("Loaded object is not a valid sklearn model!")

        return ASLClassificationModel(model, mapping, scaler, pca)

    def __init__(self, model, mapping, scaler, pca):
        self.model = model
        self.mapping = mapping
        self.scaler = scaler
        self.pca = pca

    def predict(self, feature):
        """
        feature: numpy array dạng (n_features,)
        Trả về: tên lớp dự đoán
        """
        feature = np.array(feature).reshape(1, -1)

        # Áp dụng scaler và pca giống lúc train
        feature_scaled = self.scaler.transform(feature)
        feature_reduced = self.pca.transform(feature_scaled)

        # Dự đoán
        prediction = self.model.predict(feature_reduced)[0]
        return self.mapping[prediction]
# Sign Language Classification Model with Pose Estimation

## About

This project leverages Google's MediaPipe library to perform pose estimation on webcam feed.
It then builds a simple classification model using the data coming from pose estimation to classify simple sign
language signals.

## How to use the code (Web)

**Note**: You can already run the project at is with the collected data and trained model, but you can collect and train a model of your own using the following steps:

1. Clone the project.
2. Install the packages specified in `requirements.txt`. run the following code
   pip install -r requirements.txt
3. Set up the correct path for your project.
4. (OPTIONAL) Run the following command to collect the pose data for one single sign language symbol

```
python capture_pose_data.py --pose_name="[THE NAME OF THE SYMBOL]" --confidence=[THE CONFIDENCE OF THE POSE ESTIMATON MODEL (TYPICALLY 0.5)]
```

5. (OPTIONAL) After collecting data for all the actions you want, train the model using the command

```
python train.py --model_name=[NAME OF THE MODEL YOU WANT]
```

6. (OPTIONAL) Replace the name of the model name in `config.py` with your model name
7. Run the Streamlit program using the command.

```
streamlit run main.py
```
## How to use the api translate video to text (Mobile) 

- uvicorn test_simple:app (Test api example : http://localhost:8000/process-video)

## How to use the api validate-gesture (predict-gesture.py)
- uvicorn predict-gesture:app --reload --host 0.0.0.0 --port 8001

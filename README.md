# Telco Customer Churn Prediction

A Machine Learning based web application that predicts whether a telecommunications customer is likely to churn.

The system accepts customer information through a web interface and uses a trained Machine Learning model to predict:

- Churn Prediction
- Churn Probability
- Risk Level

## Project Overview

Customer churn refers to a situation where a customer stops using a company's services.

For telecommunications companies, predicting customer churn can help identify customers who may leave so that appropriate retention strategies can be applied.

This project uses historical Telco customer data to train a Machine Learning classification model.

The trained model is integrated with a Flask backend and a web-based frontend.

## Objectives

The main objectives of this project are:

1. Analyze customer data.
2. Clean and preprocess the dataset.
3. Convert categorical customer information into numerical features.
4. Train Machine Learning classification models.
5. Compare model performance.
6. Select and train a final model.
7. Optimize the classification threshold.
8. Predict customer churn through a web application.
9. Display churn probability and risk level.
10. Provide a simple interface for testing different customer profiles.

## Technologies Used

### Programming Language

- Python

### Machine Learning

- Pandas
- NumPy
- Scikit-learn

### Backend

- Flask

### Frontend

- HTML
- CSS
- JavaScript

### Model Storage

- Pickle (.pkl)

### Development Environment

- Visual Studio Code
- Python 3

## Dataset

The project uses the Telco Customer Churn dataset.

Dataset file:

WA_Fn-UseC_-Telco-Customer-Churn.csv

The dataset contains:

- 7,043 customer records
- 21 columns

The target variable is:

Churn

Possible values:

- Yes
- No

### Churn Distribution

| Churn | Number of Customers |
|-------|--------------------:|
| No    | 5,174 |
| Yes   | 1,869 |

The dataset contains more non-churn customers than churn customers.

## Features Used

The dataset contains customer information related to:

### Customer Information

- Gender
- Senior Citizen
- Partner
- Dependents

### Services

- Phone Service
- Multiple Lines
- Internet Service
- Online Security
- Online Backup
- Device Protection
- Tech Support
- Streaming TV
- Streaming Movies

### Contract and Billing

- Tenure
- Contract
- Paperless Billing
- Payment Method
- Monthly Charges
- Total Charges

The customerID column is not used as a Machine Learning feature because it is an identifier rather than a meaningful customer characteristic.

## Data Preprocessing

The raw dataset was inspected before model training.

### TotalCharges

The TotalCharges column was originally stored as a string.

Some records contained blank values because they belonged to customers with zero months of tenure.

The column was converted into a numeric data type so that it could be used by the Machine Learning model.

### Target Encoding

The Churn column was converted into numerical values:

No = 0

Yes = 1

### Categorical Encoding

Categorical features were converted into numerical features using One-Hot Encoding.

For example, the Contract column was transformed into separate features:

- Contract_Month-to-month
- Contract_One year
- Contract_Two year

The same process was applied to the other categorical features.

## Model Development

Different Machine Learning approaches were evaluated during development.

The project initially tested classification models and compared their performance using:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion Matrix

The final training pipeline uses separate preprocessing for numerical and categorical features and trains a classification model on the processed data.

A probability-based prediction approach is used so that the application can display the probability that a customer will churn.

## Dataset Split

The final training process divided the dataset into three parts:

| Dataset | Records |
|---------|--------:|
| Training | 4,930 |
| Validation | 1,056 |
| Testing | 1,057 |
| Total | 7,043 |

The training data is used to train the model.

The validation data is used to select the prediction threshold.

The testing data is used to evaluate the final model.

## Final Model Performance

The final model achieved an accuracy of:

76.25%

### Classification Report

| Class | Precision | Recall | F1-score |
|------:|----------:|-------:|---------:|
| 0 | 0.89 | 0.77 | 0.83 |
| 1 | 0.54 | 0.75 | 0.63 |

The churn class is represented by class 1.

The model achieved a churn recall of 75%, meaning it correctly identified a substantial portion of customers who actually churned in the test set.

### Confusion Matrix

[[596 180]
 [ 71 210]]

This represents:

- 596 correctly predicted non-churn customers
- 180 non-churn customers incorrectly predicted as churn
- 71 churn customers incorrectly predicted as non-churn
- 210 correctly predicted churn customers

## Prediction Threshold

The model produces a probability of churn.

Instead of directly using the default classification threshold of 0.50, different thresholds were evaluated using the validation dataset.

The selected threshold was:

0.54

The validation Churn F1-score at this threshold was:

0.6329

The Flask application uses this threshold when converting the predicted probability into the final churn prediction.

## Risk Level

The application also displays a risk level based on the predicted churn probability.

The result contains:

- Churn Prediction
- Churn Probability
- Risk Level

Example:

Churn Prediction: Yes

Churn Probability: 90.71%

Risk Level: High

## Web Application

The project uses Flask to connect the Machine Learning model with the web interface.

The user enters customer information through the frontend.

JavaScript sends the customer information to the Flask backend.

The Flask backend loads the trained Machine Learning model and processes the input.

The model generates a churn probability.

The application then determines the churn prediction and risk level and sends the result back to the frontend.

### Application Flow

User
|
v
Web Form
|
v
JavaScript
|
v
Flask Backend
|
v
Data Preprocessing
|
v
Trained ML Model
|
v
Churn Probability
|
v
Prediction + Risk Level
|
v
Web Interface

## Project Structure

Telco_Customer_Churn_Prediction/
|
├── backend/
│   ├── app.py
│   ├── inspect_data.py
│   ├── preprocess_data.py
│   ├── compare_models.py
│   └── final_training.py
│
├── dataset/
│   └── WA_Fn-UseC_-Telco-Customer-Churn.csv
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── model/
│   └── churn_model.pkl
│
└── README.md

## Running the Project

### Step 1: Open the project folder

Open a terminal inside:

Telco_Customer_Churn_Prediction

### Step 2: Train the model

Run:

python backend/final_training.py

After successful training, the model will be saved as:

model/churn_model.pkl

### Step 3: Start the Flask application

Run:

python backend/app.py

The Flask server will start at:

http://127.0.0.1:5000

### Step 4: Open the application

Open the following address in a web browser:

http://127.0.0.1:5000

## Example Predictions

The application was tested with different customer profiles.

### Test 1 - High-Risk Customer

Churn Prediction: Yes

Churn Probability: 90.71%

Risk Level: High

### Test 2 - Low-Risk Customer

Churn Prediction: No

Churn Probability: 2.02%

Risk Level: Low

### Test 3 - High-Risk Customer

Churn Prediction: Yes

Churn Probability: 86.73%

Risk Level: High

These tests demonstrate that different customer characteristics can result in different churn predictions.

## Advantages

- Machine Learning based churn prediction
- Simple web interface
- Displays churn probability
- Displays risk level
- Uses historical customer data
- Provides an easy way to test different customer profiles
- Uses separate training, validation, and testing datasets
- Uses probability threshold optimization
- Demonstrates complete integration of Machine Learning with a web application

## Limitations

- The model is trained using a historical dataset.
- Predictions depend on the quality of the training data.
- A prediction does not guarantee that a customer will actually churn.
- The dataset represents a particular telecommunications customer population.
- Real-world customer behavior can change over time.
- The model's performance may differ when applied to new telecommunications companies or different customer populations.

## Future Improvements

Possible future improvements include:

- Adding customer retention recommendations.
- Adding feature importance visualization.
- Adding data visualization dashboards.
- Adding prediction history.
- Adding a database for storing predictions.
- Adding user authentication.
- Adding an administrator dashboard.
- Testing additional Machine Learning algorithms.
- Performing further hyperparameter tuning.
- Deploying the application online.

## Conclusion

The Telco Customer Churn Prediction system demonstrates how Machine Learning can be integrated into a web application to predict customer churn.

The system performs data inspection, preprocessing, categorical encoding, model training, model evaluation, threshold optimization, probability-based prediction, and risk classification.

The final web application allows users to enter customer information and immediately receive a churn prediction, churn probability, and risk level.

The project demonstrates an end-to-end Machine Learning workflow from raw customer data to a working web-based prediction system.
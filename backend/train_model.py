import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score
)


# ==========================================
# Project paths
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "churn_set.csv"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "churn_model.pkl"
)


# ==========================================
# 1. Load dataset
# ==========================================

df = pd.read_csv(DATASET_PATH)

print("Dataset shape:", df.shape)


# ==========================================
# 2. Clean TotalCharges
# ==========================================

df["TotalCharges"] = pd.to_numeric(
    df["TotalCharges"],
    errors="coerce"
)

df["TotalCharges"] = df["TotalCharges"].fillna(0)


# ==========================================
# 3. Convert Churn to 0/1
# ==========================================

df["Churn"] = df["Churn"].map({
    "Yes": 1,
    "No": 0
})


# ==========================================
# 4. Remove customer ID
# ==========================================

df = df.drop("customerID", axis=1)


# ==========================================
# 5. Separate features and target
# ==========================================

X = df.drop("Churn", axis=1)
y = df["Churn"]


# ==========================================
# 6. Identify column types
# ==========================================

categorical_columns = X.select_dtypes(
    include="str"
).columns.tolist()

numerical_columns = X.select_dtypes(
    exclude="str"
).columns.tolist()

print("\nCategorical columns:", len(categorical_columns))
print("Numerical columns:", len(numerical_columns))


# ==========================================
# 7. Split into training and temporary data
# ==========================================

X_train, X_temp, y_train, y_temp = train_test_split(
    X,
    y,
    test_size=0.30,
    random_state=42,
    stratify=y
)


# ==========================================
# 8. Split temporary data into validation/test
# ==========================================

X_validation, X_test, y_validation, y_test = train_test_split(
    X_temp,
    y_temp,
    test_size=0.50,
    random_state=42,
    stratify=y_temp
)

print("\nDataset split:")
print("Training:", X_train.shape)
print("Validation:", X_validation.shape)
print("Testing:", X_test.shape)


# ==========================================
# 9. Create preprocessing pipelines
# ==========================================

numeric_pipeline = Pipeline([
    (
        "imputer",
        SimpleImputer(strategy="median")
    ),
    (
        "scaler",
        StandardScaler()
    )
])


categorical_pipeline = Pipeline([
    (
        "imputer",
        SimpleImputer(strategy="most_frequent")
    ),
    (
        "encoder",
        OneHotEncoder(
            handle_unknown="ignore"
        )
    )
])


preprocessor = ColumnTransformer([
    (
        "numeric",
        numeric_pipeline,
        numerical_columns
    ),
    (
        "categorical",
        categorical_pipeline,
        categorical_columns
    )
])


# ==========================================
# 10. Create Logistic Regression model
# ==========================================

model = Pipeline([
    (
        "preprocessor",
        preprocessor
    ),
    (
        "classifier",
        LogisticRegression(
            max_iter=2000,
            class_weight="balanced",
            random_state=42
        )
    )
])


# ==========================================
# 11. Train model
# ==========================================

print("\nTraining model...")

model.fit(
    X_train,
    y_train
)

print("Training completed.")


# ==========================================
# 12. Get validation probabilities
# ==========================================

validation_probabilities = model.predict_proba(
    X_validation
)[:, 1]


# ==========================================
# 13. Find best probability threshold
# ==========================================

best_threshold = 0.50
best_f1 = 0

for threshold in [
    i / 100 for i in range(20, 71)
]:

    validation_predictions = (
        validation_probabilities >= threshold
    ).astype(int)

    score = f1_score(
        y_validation,
        validation_predictions
    )

    if score > best_f1:
        best_f1 = score
        best_threshold = threshold


print("\nBest threshold:")
print(best_threshold)

print("Validation Churn F1-score:")
print(f"{best_f1:.4f}")


# ==========================================
# 14. Evaluate on test data
# ==========================================

test_probabilities = model.predict_proba(
    X_test
)[:, 1]

test_predictions = (
    test_probabilities >= best_threshold
).astype(int)


# ==========================================
# 15. Final model results
# ==========================================

accuracy = accuracy_score(
    y_test,
    test_predictions
)

print("\n========================================")
print("FINAL MODEL RESULTS")
print("========================================")

print(
    f"\nAccuracy: {accuracy * 100:.2f}%"
)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        test_predictions
    )
)

print("\nConfusion Matrix:")

print(
    confusion_matrix(
        y_test,
        test_predictions
    )
)


# ==========================================
# 16. Save trained model
# ==========================================

os.makedirs(
    os.path.dirname(MODEL_PATH),
    exist_ok=True
)

joblib.dump(
    {
        "model": model,
        "threshold": best_threshold
    },
    MODEL_PATH
)

print("\nModel saved successfully:")
print(MODEL_PATH)
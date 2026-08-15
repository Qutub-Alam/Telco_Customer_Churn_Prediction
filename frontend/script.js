document
    .getElementById("predictionForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const data = {

            gender:
                document.getElementById("gender").value,

            SeniorCitizen:
                Number(
                    document.getElementById("seniorCitizen").value
                ),

            Partner:
                document.getElementById("partner").value,

            Dependents:
                document.getElementById("dependents").value,

            tenure:
                Number(
                    document.getElementById("tenure").value
                ),

            PhoneService:
                document.getElementById("phoneService").value,

            MultipleLines:
                document.getElementById("multipleLines").value,

            InternetService:
                document.getElementById("internetService").value,

            OnlineSecurity:
                document.getElementById("onlineSecurity").value,

            OnlineBackup:
                document.getElementById("onlineBackup").value,

            DeviceProtection:
                document.getElementById("deviceProtection").value,

            TechSupport:
                document.getElementById("techSupport").value,

            StreamingTV:
                document.getElementById("streamingTV").value,

            StreamingMovies:
                document.getElementById("streamingMovies").value,

            Contract:
                document.getElementById("contract").value,

            PaperlessBilling:
                document.getElementById("paperlessBilling").value,

            PaymentMethod:
                document.getElementById("paymentMethod").value,

            MonthlyCharges:
                Number(
                    document.getElementById("monthlyCharges").value
                ),

            TotalCharges:
                Number(
                    document.getElementById("totalCharges").value
                )
        };


        try {

            const response = await fetch(
                "/predict",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(data)
                }
            );


            const result = await response.json();


            if (!response.ok) {

                alert(
                    result.error ||
                    "Prediction failed."
                );

                return;
            }


            // =========================================
            // CHURN PREDICTION
            // =========================================

            document
                .getElementById("churnPrediction")
                .textContent =
                result.churn_prediction;


            // =========================================
            // CHURN PROBABILITY
            // =========================================

            document
                .getElementById("churnProbability")
                .textContent =
                result.churn_probability + "%";


            // =========================================
            // PROBABILITY BAR
            // =========================================

            document
                .getElementById("probabilityFill")
                .style.width =
                result.churn_probability + "%";


            // =========================================
            // RISK LEVEL
            // =========================================

            const riskElement =
                document.getElementById("riskLevel");


            riskElement.textContent =
                result.risk_level;


            // Remove previous risk classes

            riskElement.classList.remove(
                "risk-low",
                "risk-medium",
                "risk-high"
            );


            // Apply correct risk class

            if (result.risk_level === "Low") {

                riskElement.classList.add(
                    "risk-low"
                );

            } else if (result.risk_level === "Medium") {

                riskElement.classList.add(
                    "risk-medium"
                );

            } else if (result.risk_level === "High") {

                riskElement.classList.add(
                    "risk-high"
                );
            }


            // =========================================
            // SHOW RESULT
            // =========================================

            document
                .getElementById("result")
                .classList.remove("hidden");


            // =========================================
            // GENERATE EXPLANATION
            // =========================================

            generateExplanation();

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the prediction server."
            );
        }

    });


// =====================================================
// GENERATE PREDICTION EXPLANATION
// =====================================================

function generateExplanation() {

    const explanationList =
        document.getElementById("explanationList");

    const explanationTitle =
        document.getElementById("explanationTitle");

    const explanationMessage =
        document.getElementById("explanationMessage");


    // Clear previous explanation

    explanationList.innerHTML = "";

    explanationMessage.textContent = "";


    // Get current risk level

    const risk =
        document.getElementById("riskLevel").textContent;


    const reasons = [];


    // Get customer information

    const tenure =
        Number(
            document.getElementById("tenure").value
        );


    const contract =
        document.getElementById("contract").value;


    const internetService =
        document.getElementById("internetService").value;


    const onlineSecurity =
        document.getElementById("onlineSecurity").value;


    const techSupport =
        document.getElementById("techSupport").value;


    const paymentMethod =
        document.getElementById("paymentMethod").value;


    // =================================================
    // HIGH RISK
    // =================================================

    if (risk === "High") {

        explanationTitle.textContent =
            "Why this customer may be at risk";


        if (tenure <= 12) {

            reasons.push(
                "Short customer tenure"
            );
        }


        if (contract === "Month-to-month") {

            reasons.push(
                "Month-to-month contract"
            );
        }


        if (internetService === "Fiber optic") {

            reasons.push(
                "Fiber optic internet service"
            );
        }


        if (onlineSecurity === "No") {

            reasons.push(
                "No online security"
            );
        }


        if (techSupport === "No") {

            reasons.push(
                "No technical support"
            );
        }


        if (paymentMethod === "Electronic check") {

            reasons.push(
                "Electronic check payment"
            );
        }


        // If no specific factors were found

        if (reasons.length === 0) {

            reasons.push(
                "The model has identified this customer as having a higher churn probability."
            );
        }


        explanationMessage.textContent =
            "These characteristics are associated with higher churn risk in the customer data used by the model.";
    }


    // =================================================
    // LOW RISK
    // =================================================

    else if (risk === "Low") {

        explanationTitle.textContent =
            "Why this customer appears to have lower churn risk";


        if (tenure > 24) {

            reasons.push(
                "Long customer tenure"
            );
        }


        if (contract === "Two year") {

            reasons.push(
                "Two-year contract"
            );
        }


        if (onlineSecurity === "Yes") {

            reasons.push(
                "Online security enabled"
            );
        }


        if (techSupport === "Yes") {

            reasons.push(
                "Technical support enabled"
            );
        }


        if (
            paymentMethod ===
                "Bank transfer (automatic)" ||

            paymentMethod ===
                "Credit card (automatic)"
        ) {

            reasons.push(
                "Automatic payment method"
            );
        }


        // If no specific factors were found

        if (reasons.length === 0) {

            reasons.push(
                "The model has identified this customer as having a lower churn probability."
            );
        }


        explanationMessage.textContent =
            "These characteristics are associated with lower churn risk in the customer data used by the model.";
    }


    // =================================================
    // MEDIUM RISK
    // =================================================

    else {

        explanationTitle.textContent =
            "Factors affecting this prediction";


        if (tenure <= 12) {

            reasons.push(
                "Short customer tenure"
            );
        }


        if (contract === "Month-to-month") {

            reasons.push(
                "Month-to-month contract"
            );
        }


        if (internetService === "Fiber optic") {

            reasons.push(
                "Fiber optic internet service"
            );
        }


        if (onlineSecurity === "No") {

            reasons.push(
                "No online security"
            );
        }


        if (techSupport === "No") {

            reasons.push(
                "No technical support"
            );
        }


        if (paymentMethod === "Electronic check") {

            reasons.push(
                "Electronic check payment"
            );
        }


        if (reasons.length === 0) {

            reasons.push(
                "The customer has a combination of characteristics that results in a moderate churn probability."
            );
        }


        explanationMessage.textContent =
            "The prediction is based on the combination of customer characteristics provided to the Machine Learning model.";
    }


    // =================================================
    // DISPLAY REASONS
    // =================================================

    reasons.forEach(function (reason) {

        const li =
            document.createElement("li");

        li.textContent =
            reason;

        explanationList.appendChild(li);

    });

}


// =====================================================
// RESET BUTTON
// =====================================================

document
    .getElementById("resetButton")
    .addEventListener("click", function () {


        // Reset form

        document
            .getElementById("predictionForm")
            .reset();


        // Hide prediction result

        document
            .getElementById("result")
            .classList.add("hidden");


        // Reset probability bar

        document
            .getElementById("probabilityFill")
            .style.width = "0%";


        // Reset prediction text

        document
            .getElementById("churnPrediction")
            .textContent = "";


        // Reset probability text

        document
            .getElementById("churnProbability")
            .textContent = "";


        // Reset risk level

        document
            .getElementById("riskLevel")
            .textContent = "";


        // Remove risk colors

        document
            .getElementById("riskLevel")
            .classList.remove(
                "risk-low",
                "risk-medium",
                "risk-high"
            );


        // Clear explanation

        document
            .getElementById("explanationList")
            .innerHTML = "";


        document
            .getElementById("explanationMessage")
            .textContent = "";


        document
            .getElementById("explanationTitle")
            .textContent =
            "Prediction Explanation";

    });
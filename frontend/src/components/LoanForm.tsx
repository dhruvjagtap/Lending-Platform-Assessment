import { useState } from "react";

import "../sytyles/LoanForm.css";

interface LoanApplicationResponse {
  id: number;
  customerName: string;
  loanAmount: number;
  assetValue: number;
  creditScore: number;
  ltv: number;
  decision: string;
}

function LoanForm() {
  const [formData, setFormData] = useState({
    customerName: "",
    loanAmount: "",
    assetValue: "",
    creditScore: "",
  });

  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
    setResult("");
  };

  const validateForm = () => {
    const { customerName, loanAmount, assetValue, creditScore } = formData;

    const trimmedName = customerName.trim();

    const loan = Number(loanAmount);
    const assets = Number(assetValue);
    const score = Number(creditScore);

    // Name
    if (!trimmedName) {
      return "Name is required.";
    }

    // Loan amount
    if (!loanAmount) {
      return "Loan amount is required.";
    }

    if (!Number.isFinite(loan) || loan <= 0) {
      return "Loan amount must be greater than £0.";
    }

    if (loan < 100000 || loan > 1500000) {
      return "Loan amount must be between £100,000 and £1,500,000.";
    }

    // Asset value
    if (!assetValue) {
      return "Asset value is required.";
    }

    if (!Number.isFinite(assets) || assets <= 0) {
      return "Asset value must be greater than £0.";
    }

    // Credit score
    if (!creditScore) {
      return "Credit score is required.";
    }

    if (!Number.isInteger(score) || score < 1 || score > 999) {
      return "Credit score must be an integer between 1 and 999.";
    }

    return null;
  };

  const calculateLTV = () => {
    const loan = Number(formData.loanAmount);
    const assets = Number(formData.assetValue);

    if (!loan || !assets || assets <= 0) {
      return null;
    }

    return (loan / assets) * 100;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setResult("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const requestData = {
      customerName: formData.customerName.trim(),
      loanAmount: Number(formData.loanAmount),
      assetValue: Number(formData.assetValue),
      creditScore: Number(formData.creditScore),
    };

    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:5019/api/Application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data: LoanApplicationResponse | string = await response.json();

      if (!response.ok) {
        if (typeof data === "string") {
          throw new Error(data);
        }

        throw new Error("Unable to process the loan application.");
      }

      const application = data as LoanApplicationResponse;

      setResult(application.decision);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to connect to the backend.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const ltv = calculateLTV();

  return (
    <section className="form-container">
      <h1>Loan Eligibility</h1>

      <p className="form-description">
        Enter the applicant's loan and financial details.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Applicant Name */}

        <div className="form-group">
          <label htmlFor="name">Applicant Name</label>

          <input
            id="name"
            name="customerName"
            type="text"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter applicant's name"
          />
        </div>

        {/* Loan Amount */}

        <div className="form-group">
          <label htmlFor="loanAmount">Loan Amount</label>

          <input
            id="loanAmount"
            name="loanAmount"
            type="number"
            min="100000"
            max="1500000"
            step="1"
            value={formData.loanAmount}
            onChange={handleChange}
            placeholder="Enter loan amount in GBP"
          />
        </div>

        {/* Asset Value */}

        <div className="form-group">
          <label htmlFor="assetValue">Asset Value</label>

          <input
            id="assetValue"
            name="assetValue"
            type="number"
            min="1"
            step="1"
            value={formData.assetValue}
            onChange={handleChange}
            placeholder="Enter asset value in GBP"
          />
        </div>

        {/* Credit Score */}

        <div className="form-group">
          <label htmlFor="creditScore">Credit Score</label>

          <input
            id="creditScore"
            name="creditScore"
            type="number"
            min="1"
            max="999"
            step="1"
            value={formData.creditScore}
            onChange={handleChange}
            placeholder="Enter credit score (1-999)"
          />
        </div>

        {/* LTV Preview */}

        {ltv !== null && (
          <div className="ltv-preview">
            <span>Loan-to-Value (LTV)</span>

            <strong>{ltv.toFixed(2)}%</strong>
          </div>
        )}

        {error && <div className="form-error">{error}</div>}

        <button className="submit-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Checking..." : "Check Loan Eligibility"}
        </button>
      </form>

      {result && <div className="result">{result}</div>}
    </section>
  );
}

export default LoanForm;

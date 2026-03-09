import React from 'react'
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
    const navigate = useNavigate();
  return (
   <div className="container mt-5 text-center">

      <div className="card p-5 shadow-lg">
        <h1 className="text-danger">❌ Payment Failed</h1>

        <p className="mt-3">
          Something went wrong with your payment.
        </p>

        <div className="mt-4">
          <button
            className="btn btn-warning me-3"
            onClick={() => navigate(-1)}
          >
            Try Again
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>

      </div>

    </div>
  )
}

export default PaymentFailed
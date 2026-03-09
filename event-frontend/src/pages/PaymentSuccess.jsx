import React from 'react'
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    const navigate = useNavigate();
  const location = useLocation();
  const paymentId = location.state?.paymentId;
  return (
   <div className="container mt-5 text-center">

      <div className="card p-5 shadow-lg">
        <h1 className="text-success">🎉 Payment Successful</h1>

        <p className="mt-3">
          Your booking has been confirmed successfully.
        </p>

        {paymentId && (
          <p><strong>Payment ID:</strong> {paymentId}</p>
        )}

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>

    </div>
  )
}

export default PaymentSuccess
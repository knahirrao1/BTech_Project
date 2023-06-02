import React from "react";
import CheckoutSteps from "./CheckoutSteps";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import Payment from "./Payment";

const PaymentPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#f6f9fc]">
      <Header />
      <br />
      <br />
      <CheckoutSteps active={2} />
      <Payment />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default PaymentPage;

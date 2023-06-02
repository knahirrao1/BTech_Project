import React from "react";
import Header from "../Layout/Header";
import CheckoutSteps from "./CheckoutSteps";
import Checkout from "./Checkout";
import Footer from "../Layout/Footer";

const CheckoutPage = () => {
  return (
    <div>
      <Header />
      <br />
      <br />
      <CheckoutSteps active={1} />
      <Checkout />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default CheckoutPage;

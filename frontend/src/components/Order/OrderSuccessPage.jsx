import React from "react";
import Lottie from "react-lottie";

import Footer from "../Layout/Footer";
import Header from "../Layout/Header";

import animationData from "../../Assets/animations/success.json";

const OrderSuccessPage = () => {
  return (
    <div>
      <Header />
      <Success />
      <Footer />
    </div>
  );
};

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      <Lottie options={defaultOptions} width={300} height={300} />
      <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
        Your order is Successful !!!
      </h5>
      <br />
      <br />
    </div>
  );
};

export default OrderSuccessPage;

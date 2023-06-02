import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../../redux/actions/order";

import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

const TrackOrderPage = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);
  return (
    <div>
      <Header />
      <div className="w-full h-[80vh] flex justify-center items-center">
        {" "}
        <>
          {data && data?.status === "Processing" ? (
            <h1 className="text-[20px]">Your Order is Processing.</h1>
          ) : data?.status === "Transferred to delivery partner" ? (
            <h1 className="text-[20px]">
              Your Order is Transferred to delivery partner.
            </h1>
          ) : data?.status === "Shipping" ? (
            <h1 className="text-[20px]">Your Order is Shipped.</h1>
          ) : data?.status === "Received" ? (
            <h1 className="text-[20px]">
              Your Order is Received by delivery partner.
            </h1>
          ) : data?.status === "On the way" ? (
            <h1 className="text-[20px]">
              Our Delivery man is going to deliver your order.
            </h1>
          ) : data?.status === "Delivered" ? (
            <h1 className="text-[20px]">Your order is delivered !</h1>
          ) : null}
        </>
      </div>
      <Footer />
    </div>
  );
};

export default TrackOrderPage;

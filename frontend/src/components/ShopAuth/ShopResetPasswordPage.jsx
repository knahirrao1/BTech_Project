import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
import { server } from "../../server";

const ShopResetPasswordPage = () => {
  const { resetpasswordtoken } = useParams();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (resetpasswordtoken) {
      const sendRequest = async () => {
        await axios
          .post(`${server}/shop/reset-shop-password`, {
            resetpasswordtoken,
          })
          .then((res) => {
            console.log(res);
            navigate("/shop-login");
          })
          .catch((err) => {
            setError(true);
          });
      };
      sendRequest();
    }
  }, [resetpasswordtoken, navigate]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error ? (
        <p>Your token is expired!</p>
      ) : (
        <p>Your password has been changed suceessfully!</p>
      )}
    </div>
  );
};

export default ShopResetPasswordPage;

import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";

const Banner = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex}`}
      style={{
        backgroundImage:
          "url(https://res.cloudinary.com/kunalbtechproject2023/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1685706769/BTech%20Project%20Ecommerce%20Web%20App/banner.jpg?_s=public-apps)",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h1
          className={`text-[35px] leading-[1.2] text-[#fff] font-[600] capitalize`}
        >
          Best Collection of <br /> Electronics Application
        </h1>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] font-[Poppins] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Banner;

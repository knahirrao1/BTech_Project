import React from "react";
import Header from "../Layout/Header";
import Banner from "./Banner";
import Categories from "./Categories";
import BestDeals from "./BestDeals";
import FeaturedProduct from "./FeaturedProduct";
import Sponsored from "./Sponsored";
import Footer from "../Layout/Footer";

const HomePage = () => {
  return (
    <div>
      <Header activeHeading={1} />
      <Banner />
      <Categories />
      <BestDeals />
      <FeaturedProduct />
      <Sponsored />
      <Footer />
    </div>
  );
};

export default HomePage;

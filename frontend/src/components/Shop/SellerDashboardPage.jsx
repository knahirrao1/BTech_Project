import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";

import DashboardHeader from "./SellerHeader";
import DashboardSideBar from "./SellerSideBar";

import { AiOutlineArrowRight, AiOutlineShop } from "react-icons/ai";
import { Button } from "@material-ui/core";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { FiShoppingBag } from "react-icons/fi";
import { DataGrid } from "@material-ui/data-grid";

import styles from "../../styles/styles";

const ShopDashboardPage = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);

  const availableBalance = seller?.availableBalance.toFixed(2);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      flex: 0.3,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.2,
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 0.2,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      flex: 0.2,
    },
    {
      field: " ",
      flex: 0.1,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/dashboard/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        customer: item?.user.name,
        total: "₹ " + item.totalPrice,
        status: item.status,
      });
    });
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={1} />
        </div>
        <div className="w-full p-8">
          <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
          <div className="w-full block 800px:flex items-center justify-between">
            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <HiOutlineCurrencyRupee
                  size={30}
                  className="mr-2"
                  fill="#ffffff"
                />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  Account Balance{" "}
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                ₹ {availableBalance}
              </h5>
            </div>

            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <AiOutlineShop size={30} className="mr-2" fill="#000000" />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  All Orders
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {orders && orders.length}
              </h5>
              <Link to="/dashboard-orders">
                <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
              </Link>
            </div>

            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <FiShoppingBag size={30} className="mr-2" fill="#ffffff" />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  All Products
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {products && products.length}
              </h5>
              <Link to="/dashboard-products">
                <h5 className="pt-4 pl-2 text-[#077f9c]">View Products</h5>
              </Link>
            </div>
          </div>
          <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
          <div className="w-full min-h-[45vh] bg-white rounded">
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={4}
              disableSelectionOnClick
              autoHeight
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboardPage;

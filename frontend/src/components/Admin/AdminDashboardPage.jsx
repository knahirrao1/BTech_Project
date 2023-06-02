import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import { getAllSellers } from "../../redux/actions/sellers";

import styles from "../../styles/styles";

import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { FiShoppingBag } from "react-icons/fi";
import { AiOutlineShop } from "react-icons/ai";
import { DataGrid } from "@material-ui/data-grid";

import Loader from "../Layout/Loader";
import AdminHeader from "./AdminHeader";
import AdminSideBar from "./AdminSideBar";

const AdminDashboardPage = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, [dispatch]);

  const adminEarning =
    adminOrders &&
    adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.1, 0);

  const adminBalance = adminEarning?.toFixed(2);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      flex: 0.2,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.15,
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 0.15,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      flex: 0.15,
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      type: "number",
      flex: 0.15,
    },
  ];

  const row = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        status: item?.status,
        customer: item?.user.name,
        total: "₹ " + item?.totalPrice,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={1} />
          </div>
          {adminOrderLoading ? (
            <Loader />
          ) : (
            <div className="w-full p-4">
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
                      Total Earning
                    </h3>
                  </div>
                  <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                    ₹ {adminBalance}
                  </h5>
                </div>

                <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                  <div className="flex items-center">
                    <AiOutlineShop size={30} className="mr-2" fill="#000000" />
                    <h3
                      className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                    >
                      All Sellers
                    </h3>
                  </div>
                  <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                    {sellers && sellers.length}
                  </h5>
                  <Link to="/admin-sellers">
                    <h5 className="pt-4 pl-2 text-[#077f9c]">View Sellers</h5>
                  </Link>
                </div>

                <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                  <div className="flex items-center">
                    <FiShoppingBag size={30} className="mr-2" fill="#ffffff" />
                    <h3
                      className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                    >
                      All Orders
                    </h3>
                  </div>
                  <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                    {adminOrders && adminOrders.length}
                  </h5>
                  <Link to="/admin-orders">
                    <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
                  </Link>
                </div>
              </div>

              <br />
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

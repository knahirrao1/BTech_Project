import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { DataGrid } from "@material-ui/data-grid";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";

import AdminHeader from "./AdminHeader";
import AdminSideBar from "./AdminSideBar";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();

  const { adminOrders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, [dispatch]);

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
            <AdminSideBar active={2} />
          </div>

          <div className="w-full min-h-[45vh] bg-white rounded">
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOrders;

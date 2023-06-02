import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllOrdersOfShop } from "../../redux/actions/order";

import DashboardHeader from "./SellerHeader";
import DashboardSideBar from "./SellerSideBar";

import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

import { AiOutlineArrowRight } from "react-icons/ai";

const ShopAllOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller._id]);

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
      type: "number",
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
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={2} />
        </div>
        <div className="w-full justify-center flex">
          <div className="w-full mx-8 pt-1 mt-10 bg-white">
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

export default ShopAllOrders;

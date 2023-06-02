import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminHeader from "./AdminHeader";
import AdminSideBar from "./AdminSideBar";

import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineEye } from "react-icons/ai";

import axios from "axios";
import { server } from "../../server";

const AdminDashboardProducts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((res) => {
        setData(res.data.products);
      });
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Product Id",
      flex: 0.2,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.15,
    },
    {
      field: "shopname",
      headerName: "Shop Name",
      flex: 0.15,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.1,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      flex: 0.1,
    },

    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      flex: 0.1,
    },
    {
      field: "preview",
      flex: 0.1,
      headerName: "Preview",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        shopname: item.shop.name,
        price: "₹ " + item.discountPrice,
        stock: item.stock,
        sold: item.sold_out,
      });
    });

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={5} />
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

export default AdminDashboardProducts;

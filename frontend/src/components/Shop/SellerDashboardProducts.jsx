import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";

import DashboardHeader from "./SellerHeader";
import DashboardSideBar from "./SellerSideBar";
import Loader from "../Layout/Loader";

import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";

const ShopAllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };

  const columns = [
    {
      field: "id",
      headerName: "Product Id",
      flex: 0.4,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.4,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.2,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      flex: 0.2,
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      flex: 0.2,
    },
    {
      field: "",
      flex: 0.1,
      headerName: "",
      type: "number",
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
    {
      field: "",
      flex: 0.1,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "₹ " + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={3} />
        </div>
        <div className="w-full justify-center flex">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="w-full mx-8 pt-1 mt-10 bg-white">
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopAllProducts;

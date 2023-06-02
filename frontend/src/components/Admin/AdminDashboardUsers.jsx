import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllUsers } from "../../redux/actions/user";

import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";

import styles from "../../styles/styles";

import axios from "axios";
import { server } from "../../server";

import AdminHeader from "./AdminHeader";
import AdminSideBar from "./AdminSideBar";

const AdminDashboardUsers = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });

    dispatch(getAllUsers());
  };

  const columns = [
    {
      field: "id",
      headerName: "User ID",
      flex: 0.2,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.2,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.2,
    },
    {
      field: "role",
      headerName: "User Role",
      flex: 0.2,
    },
    {
      field: "deleteUser",
      flex: 0.2,
      headerName: "Delete User",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => setUserId(params.id) || setOpen(true)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  users &&
    users.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
      });
    });
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={4} />
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
          {open && (
            <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
              <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
                <div className="w-full flex justify-end cursor-pointer">
                  <RxCross1 size={25} onClick={() => setOpen(false)} />
                </div>
                <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                  Are you sure you want to delete this user?
                </h3>
                <div className="w-full flex items-center justify-center">
                  <div
                    className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                    onClick={() => setOpen(false) || handleDelete(userId)}
                  >
                    Confirm
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardUsers;

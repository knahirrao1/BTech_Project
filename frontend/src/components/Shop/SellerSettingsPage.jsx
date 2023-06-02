/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardHeader from "./SellerHeader";
import DashboardSideBar from "./SellerSideBar";

import { server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";

const ShopSettingsPage = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : ""
  );
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setAvatar(base64);

    const formData = new FormData();

    formData.append("avatar", base64);

    await axios
      .put(`${server}/shop/update-shop-avatar`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        dispatch(loadSeller());
        toast.success("Avatar updated successfully!");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/shop/update-seller-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Shop info updated succesfully!");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={6} />
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="flex w-full 800px:w-[80%] flex-col justify-center my-5">
            <div className="w-full flex items-center justify-center">
              <div className="relative">
                {seller?.avatar ? (
                  <img
                    src={`${seller.avatar}`}
                    className="w-[100px] h-[100px] rounded-full cursor-pointer"
                    alt=""
                  />
                ) : (
                  <RxAvatar
                    className="w-[100px] h-[100px] rounded-full cursor-pointer"
                    color="rgb(0 0 0/ 83%)"
                  />
                )}
                <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
                  <input
                    type="file"
                    id="image"
                    className="hidden"
                    onChange={handleImage}
                  />
                  <label htmlFor="image">
                    <AiOutlineCamera />
                  </label>
                </div>
              </div>
            </div>

            {/* shop info */}
            <form
              className="flex flex-col items-center"
              onSubmit={updateHandler}
            >
              <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">Shop Name</label>
                </div>
                <input
                  type="name"
                  placeholder={`${seller.name}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                  required
                />
              </div>
              <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">Shop description</label>
                </div>
                <input
                  type="name"
                  placeholder={`${
                    seller?.description
                      ? seller.description
                      : "Enter your shop description"
                  }`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                />
              </div>
              <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">Shop Address</label>
                </div>
                <input
                  type="name"
                  placeholder={seller?.address}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                  required
                />
              </div>

              <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">Shop Phone Number</label>
                </div>
                <input
                  type="number"
                  placeholder={seller?.phoneNumber}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                  required
                />
              </div>

              <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">Shop Zip Code</label>
                </div>
                <input
                  type="number"
                  placeholder={seller?.zipCode}
                  value={zipCode}
                  onChange={(e) => setZipcode(e.target.value)}
                  className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                  required
                />
              </div>

              <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <input
                  type="submit"
                  value="Update Shop"
                  className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                  required
                  readOnly
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSettingsPage;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

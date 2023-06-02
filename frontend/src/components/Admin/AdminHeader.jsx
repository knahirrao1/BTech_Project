import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { RxAvatar } from "react-icons/rx";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/">
          <img
            src="https://res.cloudinary.com/kunalbtechproject2023/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1685706758/BTech%20Project%20Ecommerce%20Web%20App/logo.jpg?_s=public-apps"
            alt=""
            width={150}
          />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          {user?.avatar ? (
            <img
              src={`${user.avatar}`}
              className="w-[50px] h-[50px] rounded-full object-cover"
              alt=""
            />
          ) : (
            <RxAvatar
              className="w-[50px] h-[50px] rounded-full object-cover"
              color="rgb(0 0 0 / 83%)"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;

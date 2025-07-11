import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/user";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const logoutHandler = async () => {
    try {
      await dispatch(logoutUser()); // Call Redux action that does the API request
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  const MenuItem = ({ icon: Icon, label, id, onClick }) => (
    <div
      className="flex items-center cursor-pointer w-full mb-6"
      onClick={() => {
        setActive(id);
        onClick?.();
      }}
    >
      <Icon size={20} color={active === id ? "red" : "#555"} />
      <span
        className={`pl-3 text-sm ${
          active === id ? "text-red-600" : "text-gray-800"
        } hidden md:block`}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div className="w-full bg-white shadow-sm rounded-lg p-4">
      <MenuItem icon={RxPerson} label="Profile" id={1} />
      <MenuItem icon={HiOutlineShoppingBag} label="Orders" id={2} />
      <MenuItem icon={HiOutlineReceiptRefund} label="Refunds" id={3} />
      <MenuItem
        icon={AiOutlineMessage}
        label="Inbox"
        id={4}
        onClick={() => navigate("/inbox")}
      />
      <MenuItem icon={MdOutlineTrackChanges} label="Track Order" id={5} />
      <MenuItem icon={RiLockPasswordLine} label="Change Password" id={6} />
      <MenuItem icon={TbAddressBook} label="Address" id={7} />

      {user && user.role === "Admin" && (
        <Link to="/admin/dashboard">
          <div
            className="flex items-center cursor-pointer w-full mb-6"
            onClick={() => setActive(8)}
          >
            <MdOutlineAdminPanelSettings
              size={20}
              color={active === 8 ? "red" : "#555"}
            />
            <span
              className={`pl-3 text-sm ${
                active === 8 ? "text-red-600" : "text-gray-800"
              } hidden md:block`}
            >
              Admin Dashboard
            </span>
          </div>
        </Link>
      )}

      <div
        className="flex items-center cursor-pointer w-full"
        onClick={logoutHandler}
      >
        <AiOutlineLogin size={20} color="red" />
        <span className="pl-3 text-sm text-red-600 hidden md:block">
          Log out
        </span>
      </div>
    </div>
  );
};

export default ProfileSidebar;

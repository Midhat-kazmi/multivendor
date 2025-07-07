import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller?.name || "");
  const [description, setDescription] = useState(seller?.description || "");
  const [address, setAddress] = useState(seller?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber || "");
  const [zipCode, setZipcode] = useState(seller?.zipCode || "");

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/shop/update-shop-avatar`,
            { avatar: reader.result },
            { withCredentials: true }
          )
          .then(() => {
            dispatch(loadSeller());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => toast.error(error.response.data.message));
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    axios
      .put(
        `${server}/shop/update-seller-info`,
        {
          shopName: name, // ✅ Fix: use name as shopName
          address,
          zipCode,
          phoneNumber,
          description,
        },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Shop info updated successfully!");
        dispatch(loadSeller());
      })
      .catch((error) => toast.error(error.response.data.message));
  };

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-50 py-6">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
        {/* Avatar Upload */}
        <div className="flex justify-center relative mb-6">
          <img
            src={avatar || seller?.avatar?.url}
            alt="Shop Avatar"
            className="w-[150px] h-[150px] rounded-full object-cover border-4 border-blue-500 shadow-md"
          />
          <label
            htmlFor="image"
            className="absolute bottom-2 right-2 cursor-pointer bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
          >
            <AiOutlineCamera size={20} />
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleImage}
            />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={updateHandler} className="space-y-5">
          <div>
            <label className="block font-semibold text-sm mb-1">Shop Name</label>
            <input
              type="text"
              value={name}
              placeholder="Enter shop name"
              onChange={(e) => setName(e.target.value)}
              className={`${styles.input}`}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-sm mb-1">Shop Description</label>
            <input
              type="text"
              value={description}
              placeholder="Enter shop description"
              onChange={(e) => setDescription(e.target.value)}
              className={`${styles.input}`}
            />
          </div>

          <div>
            <label className="block font-semibold text-sm mb-1">Shop Address</label>
            <input
              type="text"
              value={address}
              placeholder="Enter address"
              onChange={(e) => setAddress(e.target.value)}
              className={`${styles.input}`}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-sm mb-1">Phone Number</label>
            <input
              type="number"
              value={phoneNumber}
              placeholder="Enter phone number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`${styles.input}`}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-sm mb-1">Zip Code</label>
            <input
              type="number"
              value={zipCode}
              placeholder="Enter zip code"
              onChange={(e) => setZipcode(e.target.value)}
              className={`${styles.input}`}
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Update Shop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;

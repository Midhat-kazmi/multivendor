import React, { useState } from "react";
import styles from "../../styles/styles";
import { RxAvatar } from "react-icons/rx";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ShopCreated = () => {
  const [email, setEmail] = useState("");
  const [shopName, setShopName] = useState("");
  const [password, setPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!avatar) {
      toast.error("Please upload a shop avatar.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("shopName", shopName);
    formData.append("password", password);
    formData.append("zipCode", zipCode);
    formData.append("address", address);
    formData.append("file", avatar);

    try {
      const response = await axios.post(
        `${server}/shop/create-shop`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setEmail("");
      setShopName("");
      setPassword("");
      setZipCode("");
      setAddress("");
      setAvatar(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your shop
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Shop Name */}
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
                Shop Name
              </label>
              <input
                type="text"
                name="shopName"
                id="shopName"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Password with toggle */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                >
                  {showPassword ? (
                    <FiEye className="text-gray-500" />
                  ) : (
                    <FiEyeOff className="text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Zip Code */}
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                id="zipCode"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                id="address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Avatar Upload */}
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                Shop Avatar
              </label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-8 w-8" />
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <span>Upload</span>
                  <input
                    type="file"
                    name="avatar"
                    id="file-input"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Shop
              </button>
            </div>

            {/* Already have an account */}
            <div className={`${styles.noramlFlex} w-full justify-center`}>
              <h4 className="text-sm text-gray-600">Already have an account?</h4>
              <Link to="/shop-login" className="text-blue-600 pl-2 text-sm">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopCreated;

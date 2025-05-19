import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import styles from "../../styles/styles";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [coupouns, setCoupouns] = useState([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [minAmount, setMinAmout] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedProducts, setSelectedProducts] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${server}/coupon/get-coupon`)
      .then((res) => {
        setCoupouns(res.data.coupons);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });

    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          value,
          minAmount,
          maxAmount,
          selectedProducts,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Coupon code created successfully!");
        setCoupouns((prev) => [...prev, res.data.newCoupon]);
        setOpen(false);
        setName("");
        setValue("");
        setMinAmout("");
        setMaxAmount("");
        setSelectedProducts("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/coupon/delete-coupon/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Coupon code deleted successfully!");
        setCoupouns(coupouns.filter((coupon) => coupon._id !== id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden px-4 pt-1 mt-10 bg-white">
      <div className="w-full flex justify-end">
        <button
          type="button"
          className={`${styles.button} !w-max !h-[45px] px-4 py-2 !rounded-[5px] mr-3 mb-3 text-white`}
          onClick={() => setOpen(true)}
        >
          Create Coupon Code
        </button>
      </div>

      <div className="w-full">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Id</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Min Amount</th>
              <th className="py-2 px-4 border">Max Amount</th>
              <th className="py-2 px-4 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {coupouns.map((item, index) => (
              <tr key={item._id} className="text-center">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{item.name}</td>
                <td className="py-2 px-4 border">{item.value}%</td>
                <td className="py-2 px-4 border">${item.minAmount}</td>
                <td className="py-2 px-4 border">${item.maxAmount}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {open && (
          <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center overflow-auto">
            <div className="w-[90%] max-w-[500px] max-h-[90vh] bg-white rounded-md shadow p-4 overflow-y-auto relative">
              <div className="w-full flex justify-end sticky top-0 bg-white z-10">
                <RxCross1
                  size={30}
                  className="cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <h5 className="text-[24px] font-semibold text-center mb-4">
                Create Coupon Code
              </h5>
              <form onSubmit={handleSubmit}>
                <label className="block mb-2 text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <label className="block mb-2 text-sm font-medium">Discount Percentage</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />

                <label className="block mb-2 text-sm font-medium">Minimum Amount</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                  value={minAmount}
                  onChange={(e) => setMinAmout(e.target.value)}
                  required
                />

                <label className="block mb-2 text-sm font-medium">Maximum Amount</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  required
                />

                <label className="block mb-2 text-sm font-medium">Selected Product</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
                  value={selectedProducts}
                  onChange={(e) => setSelectedProducts(e.target.value)}
                >
                  <option value="">Choose a product</option>
                  {products.map((i) => (
                    <option value={i._id} key={i._id}>
                      {i.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className={`${styles.button} w-full h-[45px] !rounded-[5px] text-white flex items-center justify-center`}
                >
                  <span>Create</span>
                  <AiOutlinePlusCircle size={20} className="ml-2" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCoupons;

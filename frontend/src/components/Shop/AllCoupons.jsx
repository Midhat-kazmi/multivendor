import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [minAmount, setMinAmout] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedProducts, setSelectedProducts] = useState("");
  const [value, setValue] = useState("");
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setCoupons(res.data.couponCodes);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [dispatch, seller._id]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/coupon/delete-coupon/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Coupon code deleted successfully!");
        setCoupons(coupons.filter((coupon) => coupon._id !== id));
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount,
          maxAmount,
          selectedProducts,
          value,
          shopId: seller._id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Coupon code created successfully!");
        setOpen(false);
        setCoupons([...coupons, res.data.coupon]);
        // Reset fields
        setName("");
        setMinAmout("");
        setMaxAmount("");
        setSelectedProducts("");
        setValue("");
      })
      .catch((error) => toast.error(error.response.data.message));
  };

  const columns = [
    { field: "id", headerName: "ID", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Coupon Code", minWidth: 180, flex: 1.4 },
    { field: "price", headerName: "Value", minWidth: 100, flex: 0.6 },
    {
      field: "Delete",
      headerName: "",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.id)}>
          <AiOutlineDelete size={20} className="text-pink-500" />
        </Button>
      ),
    },
  ];

  const rows = coupons.map((item) => ({
    id: item._id,
    name: item.name,
    price: `${item.value} %`,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full px-4 md:px-8 pt-4 mt-4 bg-white rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">All Coupons</h2>
            <button
              onClick={() => setOpen(true)}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-500 transition"
            >
              Create Coupon
            </button>
          </div>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            autoHeight
            disableSelectionOnClick
          />

          {open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="w-[90%] sm:w-[500px] bg-white rounded-lg p-6 shadow-lg">
                <div className="flex justify-end mb-2">
                  <RxCross1
                    size={25}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Create Coupon</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Coupon Code Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Coupon name"
                      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Discount Percentage <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="e.g., 10"
                      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700">
                        Min Amount
                      </label>
                      <input
                        type="number"
                        value={minAmount}
                        onChange={(e) => setMinAmout(e.target.value)}
                        placeholder="e.g., 100"
                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700">
                        Max Amount
                      </label>
                      <input
                        type="number"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        placeholder="e.g., 500"
                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Select Product
                    </label>
                    <select
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option disabled>Choose product</option>
                      {products?.map((prod) => (
                        <option key={prod._id} value={prod.name}>
                          {prod.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-500 transition"
                  >
                    Create Coupon
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;

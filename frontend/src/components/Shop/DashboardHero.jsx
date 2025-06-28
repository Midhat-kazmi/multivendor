import React, { useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import styles from "../../styles/styles";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller]);

  const availableBalance = seller?.availableBalance?.toFixed
    ? seller.availableBalance.toFixed(2)
    : "0.00";

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    { field: "status", headerName: "Status", minWidth: 130, flex: 0.7 },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/dashboard/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="w-full p-4 sm:p-6">
      <h3 className="text-xl sm:text-2xl font-Poppins pb-3 font-semibold">
        Overview
      </h3>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Balance Card */}
        <div className="bg-white shadow rounded p-4">
          <div className="flex items-center mb-2">
            <AiOutlineMoneyCollect size={28} className="mr-2 text-gray-600" />
            <h3 className="text-sm text-gray-600 font-medium">
              Account Balance{" "}
              <span className="text-xs block sm:inline">
                (with 10% service charge)
              </span>
            </h3>
          </div>
          <h5 className="text-xl font-semibold pl-9">${availableBalance}</h5>
          <Link to="/dashboard-withdraw-money">
            <p className="text-sm text-[#077f9c] pt-3 pl-2">Withdraw Money</p>
          </Link>
        </div>

        {/* Orders Card */}
        <div className="bg-white shadow rounded p-4">
          <div className="flex items-center mb-2">
            <MdBorderClear size={28} className="mr-2 text-gray-600" />
            <h3 className="text-sm text-gray-600 font-medium">All Orders</h3>
          </div>
          <h5 className="text-xl font-semibold pl-9">
            {orders ? orders.length : 0}
          </h5>
          <Link to="/dashboard-orders">
            <p className="text-sm text-[#077f9c] pt-3 pl-2">View Orders</p>
          </Link>
        </div>

        {/* Products Card */}
        <div className="bg-white shadow rounded p-4">
          <div className="flex items-center mb-2">
            <AiOutlineMoneyCollect size={28} className="mr-2 text-gray-600" />
            <h3 className="text-sm text-gray-600 font-medium">All Products</h3>
          </div>
          <h5 className="text-xl font-semibold pl-9">
            {products ? products.length : 0}
          </h5>
          <Link to="/dashboard-products">
            <p className="text-sm text-[#077f9c] pt-3 pl-2">View Products</p>
          </Link>
        </div>
      </div>

      {/* Latest Orders Table */}
      <div className="mt-8">
        <h3 className="text-xl sm:text-2xl font-Poppins pb-3 font-semibold">
          Latest Orders
        </h3>
        <div className="bg-white shadow rounded overflow-x-auto">
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
  );
};

export default DashboardHero;

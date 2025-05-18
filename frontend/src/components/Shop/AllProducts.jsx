import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getAllProductsShop } from "../../redux/actions/product";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import Loader from "../Layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  const columns = [
    {
      field: "id",
      headerName: "Product ID",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.7,
    },
    {
      field: "sold",
      headerName: "Sold out",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "preview",
      headerName: "Preview", // ✅ added header
      flex: 0.8,
      sortable: false,
      renderCell: (params) => {
        const d = params.row.name || "product";
        const product_name = d.replace(/[^a-zA-Z0-9]/g, "_");
        return (
          <Link to={`/product/${product_name}`}>
            <button>
              <AiOutlineEye size={20} />
            </button>
          </Link>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete", // ✅ added header
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <button onClick={() => handleDelete(params.row.id)}>
          <AiOutlineDelete size={20} />
        </button>
      ),
    },
  ];

  const rows = [];
  products &&
    products.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        price: "US$" + item.discountPrice,
        sold: item.sold || 10,
        stock: item.stock || 0,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            
          />
        </div>
      )}
    </>
  );
};

export default AllProducts;

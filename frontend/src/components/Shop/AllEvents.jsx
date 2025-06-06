import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import {
  deleteEvent,
  getAllEventsShop,
} from "../../redux/actions/event";

const AllEvents = () => {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { events, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllEventsShop(seller._id));
    }
  }, [dispatch, seller]);

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
  };

  const columns = [
    {
      field: "id",
      headerName: "Event ID",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "name",
      headerName: "Event Name",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.7,
    },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 100,
      flex: 0.7,
    },
    {
      field: "preview",
      headerName: "Preview",
      flex: 0.8,
      sortable: false,
      renderCell: (params) => {
        const d = params.row.name || "event";
        const event_name = d.replace(/[^a-zA-Z0-9]/g, "_");
        return (
          <Link to={`/event/${event_name}`}>
            <button>
              <AiOutlineEye size={20} />
            </button>
          </Link>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
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
  events &&
    events.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        price: "US$" + item.discountPrice,
        stock: item.stock,
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
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllEvents;

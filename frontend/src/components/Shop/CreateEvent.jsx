import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../redux/actions/event"; 
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";


const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.events); // Create this reducer

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Event Created Successfully!");
      navigate("/dashboard-events");
      dispatch({ type: "eventCreateReset" });
    }
  }, [error, success, navigate, dispatch]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!seller?._id) {
      toast.error("Seller info not loaded yet.");
      return;
    }

    const newForm = new FormData();
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);
    newForm.append("start_Date", startDate);
    newForm.append("Finish_Date", endDate);
    newForm.append("shopId", seller._id);

    images.forEach((image) => {
      newForm.append("images", image);
    });

    dispatch(createEvent(newForm));
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-md h-[85vh] rounded p-6 overflow-y-scroll">
      <h5 className="text-3xl font-semibold text-center mb-6">Create Event</h5>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block pb-1 font-medium">Event Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block pb-1 font-medium">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded resize-none"
            rows={4}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block pb-1 font-medium">Category</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Select Category</option>
            {categoriesData.map((cat) => (
              <option key={cat.title} value={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block pb-1 font-medium">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        {/* Prices */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block pb-1 font-medium">Original Price</label>
            <input
              type="number"
              required
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block pb-1 font-medium">Discount Price</label>
            <input
              type="number"
              required
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block pb-1 font-medium">Stock</label>
          <input
            type="number"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        {/* Dates */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block pb-1 font-medium">Start Date</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block pb-1 font-medium">End Date</label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Upload Images */}
        <div>
          <label className="block pb-1 font-medium">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            id="eventImages"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex flex-wrap gap-4">
            {images.map((image, index) => {
              const imageUrl = URL.createObjectURL(image);
              return (
                <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                  <img src={imageUrl} alt={`event-${index}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-bl px-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
            <label
              htmlFor="eventImages"
              className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded cursor-pointer hover:bg-gray-100 text-gray-500 text-3xl"
            >
              +
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;

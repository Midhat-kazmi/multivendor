import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { createEvent, getAllEventsShop } from "../../redux/actions/event";

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.events);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : "";

  const handleStartDateChange = (e) => {
    const selected = new Date(e.target.value);
    setStartDate(selected);
    setEndDate(null);
  };

  const handleEndDateChange = (e) => {
    setEndDate(new Date(e.target.value));
  };

  useEffect(() => {
    if (error) toast.error(error);
    if (success) {
      toast.success("Event created successfully!");
      dispatch(getAllEventsShop(seller._id));
      navigate("/dashboard-events");
      window.location.reload();
    }
  }, [dispatch, error, success, navigate, seller._id]);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const previews = [];
    const base64Images = [];

    for (let file of files) {
      previews.push(URL.createObjectURL(file));

      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

      base64Images.push(base64);
    }

    setImagePreview(previews);
    setImages(base64Images);
  };

  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates!");
      return;
    }

    if (!images.length) {
      toast.error("Please select at least one image!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("originalPrice", originalPrice || 0);
    formData.append("discountPrice", discountPrice);
    formData.append("stock", stock);
    formData.append("shopId", seller._id);
    formData.append("start_Date", startDate.toISOString());
    formData.append("end_Date", endDate.toISOString());

    images.forEach((img) => {
      formData.append("images", img); // Base64 string
    });

    dispatch(createEvent(formData));
  };

 return (
  <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 overflow-y-auto max-h-[85vh]">
    <h2 className="text-2xl font-semibold text-center mb-6 font-Poppins">Create Event</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block font-medium">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Event product name"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Description..."
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-medium">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Choose a category</option>
          {categoriesData.map((cat) => (
            <option value={cat.title} key={cat.title}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block font-medium">Tags</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tags..."
        />
      </div>

      {/* Prices & Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium">Original Price</label>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium">
            Discount Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium">
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            min={today}
            value={startDate ? startDate.toISOString().slice(0, 10) : ""}
            onChange={handleStartDateChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            min={minEndDate}
            value={endDate ? endDate.toISOString().slice(0, 10) : ""}
            onChange={handleEndDateChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block font-medium">
          Upload Images <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="upload"
        />
        <label
          htmlFor="upload"
          className="cursor-pointer inline-flex items-center space-x-2 text-blue-600 mt-2 hover:underline"
        >
          <AiOutlinePlusCircle size={24} />
          <span>Choose Images</span>
        </label>
        <div className="flex flex-wrap gap-3 mt-4">
          {imagePreview.map((url, index) => (
            <img
              key={index}
              src={url}
              alt="Preview"
              className="w-28 h-28 object-cover rounded-md border"
            />
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Create Event
        </button>
      </div>
    </form>
  </div>
);

};

export default CreateEvent;

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
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : "";

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Event created successfully!");
      dispatch(getAllEventsShop(seller._id));
      navigate("/dashboard-events");
      window.location.reload();
    }
  }, [dispatch, error, success, navigate, seller._id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreview]);

  const handleStartDateChange = (e) => {
    const selected = new Date(e.target.value);
    setStartDate(selected);
    setEndDate(null);
  };

  const handleEndDateChange = (e) => {
    const selected = new Date(e.target.value);
    setEndDate(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) return toast.error("Select both dates.");
    if (!images.length) return toast.error("Please add at least one image.");

    try {
      // Convert to base64
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });

      const base64Images = await Promise.all(images.map(toBase64));

      const payload = {
        name,
        description,
        category,
        tags,
        originalPrice: originalPrice || 0,
        discountPrice,
        stock,
        images: base64Images,
        shopId: seller._id,
        start_Date: startDate.toISOString(),
        Finish_Date: endDate.toISOString(),
      };

      dispatch(createEvent(payload));
    } catch (err) {
      console.error("Image conversion error:", err);
      toast.error("Error uploading images. Try again.");
    }
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Event</h5>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label>Name *</label>
            <input
              type="text"
              value={name}
              className="input"
              onChange={(e) => setName(e.target.value)}
              placeholder="Event name"
            />
          </div>
          <div>
            <label>Description *</label>
            <textarea
              rows="5"
              value={description}
              className="input"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
            />
          </div>
          <div>
            <label>Category *</label>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Choose category</option>
              {categoriesData.map((i) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Tags</label>
            <input
              type="text"
              value={tags}
              className="input"
              onChange={(e) => setTags(e.target.value)}
              placeholder="Event tags"
            />
          </div>
          <div>
            <label>Original Price</label>
            <input
              type="number"
              value={originalPrice}
              className="input"
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Original price"
            />
          </div>
          <div>
            <label>Discount Price *</label>
            <input
              type="number"
              value={discountPrice}
              className="input"
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Discounted price"
              required
            />
          </div>
          <div>
            <label>Stock *</label>
            <input
              type="number"
              value={stock}
              className="input"
              onChange={(e) => setStock(e.target.value)}
              placeholder="Product stock"
              required
            />
          </div>
          <div>
            <label>Start Date *</label>
            <input
              type="date"
              value={startDate ? startDate.toISOString().slice(0, 10) : ""}
              className="input"
              min={today}
              onChange={handleStartDateChange}
              required
            />
          </div>
          <div>
            <label>End Date *</label>
            <input
              type="date"
              value={endDate ? endDate.toISOString().slice(0, 10) : ""}
              className="input"
              min={minEndDate}
              id="end-date"
              onChange={handleEndDateChange}
              required
            />
          </div>
          <div>
            <label>Upload Images *</label>
            <input
              type="file"
              name="images"
              id="upload"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            <label htmlFor="upload" className="cursor-pointer">
              <AiOutlinePlusCircle size={30} color="#555" />
            </label>
            <div className="flex flex-wrap mt-2">
              {imagePreview.map((url, i) => (
                <img
                  src={url}
                  key={i}
                  alt={`preview ${i}`}
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
            </div>
          </div>
          <div>
            <input
              type="submit"
              value="Create"
              className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;

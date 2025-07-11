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
    formData.append("Finish_Date", endDate.toISOString());

    images.forEach((img) => {
      formData.append("images", img); // Base64 string
    });

    dispatch(createEvent(formData));
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Event</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">Name <span className="text-red-500">*</span></label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Event product name" />
        </div>
        <br />
        <div>
          <label className="pb-2">Description <span className="text-red-500">*</span></label>
          <textarea rows="5" value={description} onChange={(e) => setDescription(e.target.value)} className="input" placeholder="Description..." />
        </div>
        <br />
        <div>
          <label className="pb-2">Category <span className="text-red-500">*</span></label>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Choose a category</option>
            {categoriesData.map((cat) => (
              <option value={cat.title} key={cat.title}>{cat.title}</option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Tags</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="input" placeholder="Tags..." />
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="input" />
        </div>
        <br />
        <div>
          <label className="pb-2">Discount Price <span className="text-red-500">*</span></label>
          <input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} className="input" />
        </div>
        <br />
        <div>
          <label className="pb-2">Stock <span className="text-red-500">*</span></label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="input" />
        </div>
        <br />
        <div>
          <label className="pb-2">Start Date <span className="text-red-500">*</span></label>
          <input type="date" min={today} value={startDate ? startDate.toISOString().slice(0, 10) : ""} onChange={handleStartDateChange} className="input" />
        </div>
        <br />
        <div>
          <label className="pb-2">End Date <span className="text-red-500">*</span></label>
          <input type="date" min={minEndDate} value={endDate ? endDate.toISOString().slice(0, 10) : ""} onChange={handleEndDateChange} className="input" />
        </div>
        <br />
        <div>
          <label className="pb-2">Upload Images <span className="text-red-500">*</span></label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="upload" />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {imagePreview.map((url, index) => (
              <img key={index} src={url} alt="" className="h-[120px] w-[120px] object-cover m-2" />
            ))}
          </div>
        </div>
        <br />
        <input type="submit" value="Create" className="input cursor-pointer bg-blue-500 text-white font-semibold" />
      </form>
    </div>
  );
};

export default CreateEvent;

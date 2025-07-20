import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);

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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product Created Successfully!");
      navigate("/dashboard");
      dispatch({ type: "productCreateReset" });
    }
  }, [error, success, navigate, dispatch]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!seller?._id) {
      toast.error("Seller not loaded");
      return;
    }

    // Convert images to base64
    const convertToBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    try {
      const base64Images = await Promise.all(images.map(convertToBase64));

      const payload = {
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        shopId: seller._id,
        images: base64Images,
      };

      dispatch(createProduct(payload));
    } catch (err) {
      toast.error("Failed to process images. Try again.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-md h-[85vh] rounded p-6 overflow-y-scroll">
      <h5 className="text-3xl font-semibold text-center mb-6">Create Product</h5>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Name */}
        <div>
          <label className="block pb-1 font-medium">Product Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter product name"
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
            placeholder="Enter product description"
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
            {categoriesData &&
              categoriesData.map((cat) => (
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
            placeholder="Enter tags (comma separated)"
          />
        </div>

        {/* Pricing */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block pb-1 font-medium">Original Price</label>
            <input
              type="number"
              required
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter original price"
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
              placeholder="Enter discount price"
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
            placeholder="Enter available stock"
          />
        </div>

        {/* Images Upload */}
        <div>
          <label className="block pb-1 font-medium">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            id="uploadImages"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex flex-wrap gap-4">
            {images.map((image, index) => {
              const imageUrl = URL.createObjectURL(image);
              return (
                <div
                  key={index}
                  className="relative w-24 h-24 border rounded overflow-hidden"
                >
                  <img
                    src={imageUrl}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== index))
                    }
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-bl px-1 text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
            <label
              htmlFor="uploadImages"
              className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded cursor-pointer hover:bg-gray-100 text-gray-500 text-3xl"
            >
              +
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-500 w-full"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;

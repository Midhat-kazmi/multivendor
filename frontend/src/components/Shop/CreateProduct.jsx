import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Optional: Revoke object URLs
    images.forEach((image) => URL.revokeObjectURL(image));

    console.log({
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      images,
    });
  };

  return (
    <div className="w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-5 overflow-y-scroll">
      <h5 className="text-[30px] font-poppins text-center mb-5">
        Create Product
      </h5>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="block pb-1 font-medium">Category</label>
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="e.g. Electronics, Fashion"
          />
        </div>

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

        {/* Enhanced Image Upload Section */}
        <div>
  <label className="block pb-1 font-medium">Upload Images</label>

  {/* Hidden File Input */}
  <input
    type="file"
    accept="image/*"
    multiple
    id="uploadImages"
    onChange={(e) => setImages([...images, ...Array.from(e.target.files)])}
    className="hidden"
  />

  {/* Preview Section with Plus Button */}
  <div className="flex flex-wrap gap-4">
    {/* Image Previews */}
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
            onClick={() => setImages(images.filter((_, i) => i !== index))}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl px-1 text-xs hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      );
    })}

    {/* Plus Button */}
    <label
      htmlFor="uploadImages"
      className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded cursor-pointer hover:bg-gray-100 text-gray-500 text-3xl"
    >
      +
    </label>
  </div>
</div>


        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;

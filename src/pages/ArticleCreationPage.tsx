import React, { useState, useEffect } from "react";
import { getAllCategories, createArticles } from "../api/userApi"; // Import API function
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
interface Category {
  _id: string;
  categoryName: string;
}

const ArticleCreationPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articleName, setArticleName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [tagInput, setTagInput] = useState("");

  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate()
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getAllCategories();
        console.log(response);
        
        setCategories(response.allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category); // Allow only one selection
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  const handleTagAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tagInput.trim()) {
      event.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

 
  const handleSubmit = async () => {
    if (!articleName || !description || !selectedCategory) {
      alert("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("articleName", articleName);
    formData.append("description", description);
    formData.append("tags",tags.join(","));
    formData.append("category", selectedCategory._id);
    if (image) {
      formData.append("image", image);
    }
    if (user?._id) {
      formData.append("userId", user._id);
    }

    try {
      const response = await createArticles(formData); // API call
      console.log("Article Created:", response);
      navigate("/feed")
      setArticleName("");
      setDescription("");
      setTags([]);
      setSelectedCategory(null);
      setImage(null);
    } catch (error) {
      console.error("Error creating article:", error);
      alert("Failed to create article.");
    }
  };

  return (

    <>
    <NavBar/>
   
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Create Article</h2>

      {/* Article Name */}
      <div className="mb-4">
        <label className="block text-gray-700">Article Name</label>
        <input
          type="text"
          value={articleName}
          onChange={(e) => setArticleName(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md"
        ></textarea>
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-gray-700">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-md" />
        {image && (
          <div className="mt-2">
            <p className="text-gray-600">Preview:</p>
            <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-40 object-cover rounded-md mt-2" />
          </div>
        )}
      </div>

      {/* Tags Input */}
      <div className="mb-4">
        <label className="block text-gray-700">Tags (Press Enter to add)</label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagAdd}
          className="w-full p-2 border rounded-md"
          placeholder="Enter a tag and press Enter"
        />
        {/* Tags Display */}
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center px-3 py-1 bg-gray-300 rounded-md">
              #{tag}
              <button onClick={() => handleTagRemove(tag)} className="ml-2 text-red-500">×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <label className="block text-gray-700">Select Category</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategorySelect(category)}
              className={`px-3 py-1 rounded-md ${
                selectedCategory?._id === category._id ? "bg-blue-700 text-white" : "bg-blue-500 text-white"
              }`}
            >
              {category.categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Category */}
      {selectedCategory && (
        <div className="mb-4">
          <label className="block text-gray-700">Selected Category</label>
          <div className="flex items-center px-3 py-1 bg-gray-300 rounded-md">
            {selectedCategory.categoryName}
            <button onClick={() => setSelectedCategory(null)} className="ml-2 text-red-500">×</button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button onClick={handleSubmit} className="w-full bg-green-500 text-white p-2 rounded-md">
        Submit
      </button>
    </div>
    </>
  );
};

export default ArticleCreationPage;

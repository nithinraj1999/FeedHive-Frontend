import React, { useState, useEffect } from "react";
import { getAllCategories, createArticles } from "../api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
interface Category {
  _id: string;
  categoryName: string;
}

// ✅ Define Zod Schema
const articleSchema = z.object({
  articleName: z.string().min(3, "Article name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.instanceof(File).optional(),
  tags: z.array(z.string().min(2, "Tags must be at least 2 characters")).max(5, "Max 5 tags allowed"),
  selectedCategory: z.object({
    _id: z.string(),
    categoryName: z.string(),
  }),
});

const ArticleCreationPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articleName, setArticleName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getAllCategories();
        setCategories(response.allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setErrors((prev) => ({ ...prev, selectedCategory: "" }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleTagAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tagInput.trim()) {
      event.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()]);
        setErrors((prev) => ({ ...prev, tags: "" }));
      }
      setTagInput("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    const formData = {
      articleName,
      description,
      image,
      tags,
      selectedCategory,
    };

    const result = articleSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        formattedErrors[err.path[0] as string] = err.message;
      });
      setErrors(formattedErrors);
      return;
    }

    const data = new FormData();
    data.append("articleName", articleName);
    data.append("description", description);
    data.append("tags", tags.join(","));
    data.append("category", selectedCategory!._id);
    if (image) data.append("image", image);
    if (user?._id) data.append("userId", user._id);

    try {
      const response = await createArticles(data);
      console.log(response);
      
      navigate("/feed");
      setArticleName("");
      setDescription("");
      setTags([]);
      setSelectedCategory(null);
      setImage(null);
      setErrors({});
    } catch (error) {
      console.error("Error creating article:", error);
      alert("Failed to create article.");
    }
  };

  return (
    <>
      <NavBar />

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
          {errors.articleName && <p className="text-red-500 text-sm">{errors.articleName}</p>}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-700">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-md" />
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
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
          {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center px-3 py-1 bg-gray-300 rounded-md">
                #{tag}
                <button onClick={() => handleTagRemove(tag)} className="ml-2 text-red-500">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-4">
          <label className="block text-gray-700">Select Category</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategorySelect(category)}
                className={`px-3 py-1 rounded-md ${
                  selectedCategory?._id === category._id ? "bg-black text-white" : "bg-blue-500 text-white"
                }`}
              >
                {category.categoryName}
              </button>
            ))}
          </div>
          {errors.selectedCategory && <p className="text-red-500 text-sm">{errors.selectedCategory}</p>}
        </div>

        <button onClick={handleSubmit} className="w-full bg-green-500 text-white p-2 rounded-md">
          Submit
        </button>
      </div>
    </>
  );
};  

export default ArticleCreationPage;

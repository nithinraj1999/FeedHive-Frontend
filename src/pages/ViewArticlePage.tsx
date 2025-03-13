import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaExclamationTriangle, FaEdit } from "react-icons/fa";
import { viewArticles, updateArticle, getAllCategories } from "../api/userApi";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
interface Article {
  _id: string;
  articleName: string;
  description: string;
  userId:string
  image: string;
  tags: string[];
  likes: number;
  dislikes: number;
  category: string;
  blockCount: number;
  createdAt: string;
  isBlocked: boolean;
}

interface Category {
  _id: string;
  categoryName: string;
}

const ViewArticlePage = () => {
  const [article, setArticle] = useState<Article | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedArticle, setEditedArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    async function fetchArticleDetails() {
      const articleId = query.get("articleId");
      if (articleId) {
        const response = await viewArticles({ articleId });
        setArticle(response.article);
        setEditedArticle(response.article);
      }
    }
    async function fetchCategories() {
      const response = await getAllCategories();
      setCategories(response.allCategories);
    }
    fetchArticleDetails();
    fetchCategories();
  }, []);

  const handleEditClick = () => setIsEditing(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedArticle) return;
    setEditedArticle({ ...editedArticle, [e.target.name]: e.target.value });
  };

  const handleTagAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tagInput.trim() && editedArticle) {
      event.preventDefault();
      if (!editedArticle.tags.includes(tagInput.trim())) {
        setEditedArticle(prev => prev ? { ...prev, tags: [...prev.tags, tagInput.trim()] } : null);
      }
      setTagInput("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setEditedArticle(prev => prev ? { ...prev, tags: prev.tags.filter(t => t !== tag) } : null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setEditedArticle(prev => prev ? { ...prev, image: URL.createObjectURL(file) } : null);
    }
  };

  const handleSave = async () => {
    if (!editedArticle || !article) return;

    const formData = new FormData();

    if (editedArticle.articleName !== article.articleName) {
      formData.append("articleName", editedArticle.articleName);
    }
    if (editedArticle.description !== article.description) {
      formData.append("description", editedArticle.description);
    }
    if (editedArticle.category !== article.category) {
      formData.append("category", editedArticle.category);
    }
    if (editedArticle.tags.join(",") !== article.tags.join(",")) {
        formData.append("tags",editedArticle.tags.join(","));
    }

    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    if(article._id){
        formData.append("articleId", article._id);
    }
    try {
      const response = await updateArticle( formData);
      if (response.success) {
        setArticle({ ...article, ...editedArticle });
        setIsEditing(false);
      } else {
        alert("Failed to update article.");
      }
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <img
          src={article?.image }
          alt={article?.articleName}
          className="w-full h-64 object-cover rounded-md"
        />

        <div className="mt-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{article?.articleName}</h1>
            <p className="text-gray-500 text-sm">Published on {article?.createdAt}</p>
          </div>
          {article?.userId==user?._id &&
          
          <button className="text-blue-500 hover:underline flex items-center" onClick={handleEditClick}>
            <FaEdit className="mr-1" /> Edit
          </button>
}
        </div>

        <p className="mt-4 text-gray-700">{article?.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {article?.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-4 text-gray-600">
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <FaThumbsUp />
              <span>{article?.likes}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-red-500">
              <FaThumbsDown />
              <span>{article?.dislikes}</span>
            </button>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <FaExclamationTriangle className="text-yellow-500" />
            <span>{article?.blockCount} Reports</span>
          </div>
        </div> */}
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[800px]">
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Article</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Title:</label>
                <input type="text" name="articleName" value={editedArticle?.articleName || ""} onChange={handleChange} className="w-full border p-2 rounded-md" />

                <label className="block mb-2">Description:</label>
                <textarea name="description" value={editedArticle?.description || ""} onChange={handleChange} className="w-full border p-2 rounded-md"></textarea>

                <label className="block mb-2">Tags (Press Enter to add):</label>
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagAdd} className="w-full p-2 border rounded-md" />

                <div className="flex flex-wrap gap-2 mt-2">
                  {editedArticle?.tags?.map((tag, index) => (
                    <div key={index} className="flex items-center px-3 py-1 bg-gray-300 rounded-md">
                      #{tag}
                      <button onClick={() => handleTagRemove(tag)} className="ml-2 text-red-500">×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2">Upload New Image:</label>
                <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-md" />
                <img src={editedArticle?.image || "https://via.placeholder.com/600x400"} alt="Preview" className="w-full h-40 object-cover rounded-md mt-2" />

                <label className="block text-gray-700">Category:</label>
                <select value={editedArticle?.category || ""} onChange={(e) => setEditedArticle(prev => prev ? { ...prev, category: e.target.value } : null)} className="w-full p-2 border rounded-md">
                  {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.categoryName}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewArticlePage;

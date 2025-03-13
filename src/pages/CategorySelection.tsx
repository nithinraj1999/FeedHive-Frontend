import { useEffect, useState } from "react";
import { getAllCategories, saveUserCategories } from "../api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useNavigate } from "react-router-dom";
// Define the category type
import { useLocation } from "react-router-dom";


interface Category {
  _id: string;
  categoryName: string;
}

// Define API response type
interface ApiResponse {
  success: boolean;
  allCategories: Category[];
}

const CategorySelection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  const navigate = useNavigate()
  // Fetch categories from the backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response: ApiResponse = await getAllCategories();
        if (response.success) {
          setCategories(response.allCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Send selected categories to backend
  const saveCategories = async () => {
    try {

      console.log(selectedCategories);
      const data = {
        userId:query.get("userId"),
        categoryId:selectedCategories
      }
      const response = await saveUserCategories(data);
      if (response.success) {
        navigate('/')
        console.log("Categories saved successfully");
      }
    } catch (error) {
      console.error("Error saving categories:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Select Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => handleCategorySelect(category._id)}
            className={`flex items-center justify-center h-32 w-40 md:w-48 rounded-2xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer bg-blue-500 ${
              selectedCategories.includes(category._id) ? "ring-4 ring-black" : ""
            }`}
          >
            <span className="text-white text-xl font-semibold">
              {category.categoryName}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={saveCategories}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
      >
        Save Categories
      </button>
    </div>
  );
};

export default CategorySelection;

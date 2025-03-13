import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useNavigate } from "react-router-dom";
import { getMyArticles } from "../api/userApi";
import NavBar from "../components/NavBar";
// Define Article type
interface Article {
  _id: string;
  articleName: string;
  image: string;
  tags: string[];
  likes: number;
  dislikes: number;
  blockCount: number;
  isBlock: boolean;
  createdAt: Date;
}

const MyArticles: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [articles, setArticles] = useState<Article[]>([]);

    const navigate = useNavigate()
  const handleArticleClick = (articleId: string) => {
    navigate(`/view-article?articleId=${articleId}`);
  };

  useEffect(() => {
    async function fetchArticles(userId: string) {
      try {
        const response = await getMyArticles({ userId });
        console.log(response);
        if (response?.myArticles) {
          setArticles(response.myArticles);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }
    if (user?._id) {
      fetchArticles(user._id);
    }
  }, [user?._id]); 

  return (

    <>
  <NavBar/>
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">My Articles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article._id}
            className={`bg-white p-4 rounded-lg shadow-md flex flex-col items-center ${
              article.isBlock ? "opacity-50" : ""
            }`}
          >
            <img
              src={article.image}
              alt={article.articleName}
              className="w-full h-60 object-cover rounded-md"
              onClick={()=>handleArticleClick(article._id)}
            />
            <div className="mt-4 text-center">
              <h2 className="text-lg font-semibold" onClick={()=>handleArticleClick(article._id)}>{article.articleName}</h2>
              <p className="text-sm text-gray-500">
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap justify-center space-x-2 mt-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-200 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-4 mt-2 text-gray-600">
                <button className="flex items-center space-x-1 hover:text-blue-500">
                  <FaThumbsUp />
                  <span>{article.likes}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-red-500">
                  <FaThumbsDown />
                  <span>{article.dislikes}</span>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Block Count: {article.blockCount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    </>
  );
};

export default MyArticles;

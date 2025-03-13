// import React, { useEffect, useState } from "react";
// import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
// import { useSelector } from "react-redux";
// import { RootState } from "../state/store";
// import { getAllArticles } from "../api/userApi";
// import { useNavigate } from "react-router-dom";
// import NavBar from "../components/NavBar";
// interface Article {
//   _id: string;
//   articleName: string;
//   image: string;
//   tags: string[];
//   likes: number;
//   dislikes: number;
//   blockCount: number;
//   isBlock: boolean;
//   createdAt: Date;
// }

// const ArticleFeed: React.FC = () => {
//   const user = useSelector((state: RootState) => state.auth.user);
//   const [articles, setArticles] = useState<Article[]>([]);

//     const navigate = useNavigate()
//   const handleArticleClick = (articleId: string) => {
//     navigate(`/view-article?articleId=${articleId}`);
//   };

//   useEffect(() => {
//     async function fetchArticles(userId: string) {
//       try {
//         const response = await getAllArticles({ userId });
//         console.log(response);
//         if (response?.allArticles) {
//           setArticles(response.allArticles);
//         }
//       } catch (error) {
//         console.error("Error fetching articles:", error);
//       }
//     }
//     if (user?._id) {
//       fetchArticles(user._id);
//     }
//   }, [user?._id]); // Depend on user._id to avoid stale state

//   return (
//     <>
//     <NavBar/>
   
//     <div className="max-w-6xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6 text-center">Latest Articles</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {articles.map((article) => (
//           <div
//             key={article._id}
//             className={`bg-white p-4 rounded-lg shadow-md flex flex-col items-center ${
//               article.isBlock ? "opacity-50" : ""
//             }`}
//           >
//             <img
//               src={article.image}
//               alt={article.articleName}
//               className="w-full h-60 object-cover rounded-md"
//               onClick={()=>handleArticleClick(article._id)}
//             />
//             <div className="mt-4 text-center">
//               <h2 className="text-lg font-semibold" onClick={()=>handleArticleClick(article._id)}>{article.articleName}</h2>
//               <p className="text-sm text-gray-500">
//                 {new Date(article.createdAt).toLocaleDateString()}
//               </p>
//               <div className="flex flex-wrap justify-center space-x-2 mt-2">
//                 {article.tags.map((tag, index) => (
//                   <span
//                     key={index}
//                     className="text-xs bg-gray-200 px-2 py-1 rounded-full"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//               <div className="flex items-center justify-center space-x-4 mt-2 text-gray-600">
//                 <button className="flex items-center space-x-1 hover:text-blue-500">
//                   <FaThumbsUp />
//                   <span>{article.likes}</span>
//                 </button>
//                 <button className="flex items-center space-x-1 hover:text-red-500">
//                   <FaThumbsDown />
//                   <span>{article.dislikes}</span>
//                 </button>
//               </div>
//               <p className="text-xs text-gray-400 mt-2">
//                 Block Count: {article.blockCount}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//     </>
//   );
// };

// export default ArticleFeed;



import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { getAllArticles, updateArticleReaction } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

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

const ArticleFeed: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();

  const handleArticleClick = (articleId: string) => {
    navigate(`/view-article?articleId=${articleId}`);
  };

  useEffect(() => {
    async function fetchArticles(userId: string) {
      try {
        const response = await getAllArticles({ userId });
        if (response?.allArticles) {
          setArticles(response.allArticles);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }
    if (user?._id) {
      fetchArticles(user._id);
    }
  }, [user?._id]);

  // Handle like/dislike
  const handleReaction = async (articleId: string, type: "like" | "dislike") => {
    try {
      // Optimistic UI update
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article._id === articleId
            ? {
                ...article,
                likes: type === "like" ? article.likes + 1 : article.likes,
                dislikes: type === "dislike" ? article.dislikes + 1 : article.dislikes,
              }
            : article
        )
      );

      // Send request to backend
      const response = await updateArticleReaction({userId:user?._id, articleId, type });

      if (!response?.success) {
        console.error("Failed to update reaction");

        // Rollback state if request fails
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article._id === articleId
              ? {
                  ...article,
                  likes: type === "like" ? article.likes - 1 : article.likes,
                  dislikes: type === "dislike" ? article.dislikes - 1 : article.dislikes,
                }
              : article
          )
        );
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Latest Articles</h1>
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
                className="w-full h-60 object-cover rounded-md cursor-pointer"
                onClick={() => handleArticleClick(article._id)}
              />
              <div className="mt-4 text-center">
                <h2
                  className="text-lg font-semibold cursor-pointer"
                  onClick={() => handleArticleClick(article._id)}
                >
                  {article.articleName}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap justify-center space-x-2 mt-2">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-4 mt-2 text-gray-600">
                  <button
                    className="flex items-center space-x-1 hover:text-blue-500"
                    onClick={() => handleReaction(article._id, "like")}
                  >
                    <FaThumbsUp />
                    <span>{article.likes}</span>
                  </button>
                  <button
                    className="flex items-center space-x-1 hover:text-red-500"
                    onClick={() => handleReaction(article._id, "dislike")}
                  >
                    <FaThumbsDown />
                    <span>{article.dislikes}</span>
                  </button>
                </div>
                {/* <p className="text-xs text-gray-400 mt-2">Block Count: {article.blockCount}</p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ArticleFeed;

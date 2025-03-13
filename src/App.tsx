import {  Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import SignIn from "./pages/signin";
import Profile from "./pages/profile";
import ArticleCreationPage from "./pages/ArticleCreationPage";
import ArticleFeed from "./pages/ArticleFeed";
import ViewArticlePage from "./pages/ViewArticlePage";
import MyArticles from "./pages/MyArticles";
import CategorySelection from "./pages/CategorySelection";
function App() {
  return (
    <>
     <Routes>
      <Route path="/" element={<SignIn/>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/my-profile" element={<Profile />} />
      <Route path="/create-article" element={<ArticleCreationPage />} />
      <Route path="/feed" element={<ArticleFeed />} />
      <Route path="/view-article" element={<ViewArticlePage />} />
      <Route path="/my-articles" element={<MyArticles />} />
      <Route path="/select-category" element={<CategorySelection/>} />


    </Routes>
    </>
  );
}

export default App;

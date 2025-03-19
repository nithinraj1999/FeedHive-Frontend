import {  Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import SignIn from "./pages/signin";
import Profile from "./pages/profile";
import ArticleCreationPage from "./pages/ArticleCreationPage";
import ArticleFeed from "./pages/ArticleFeed";
import ViewArticlePage from "./pages/ViewArticlePage";
import MyArticles from "./pages/MyArticles";
import CategorySelection from "./pages/CategorySelection";
import PrivateRoute from "./components/Prrotected";

function App() {
  return (
    <>
     <Routes>
      <Route path="/" element={<SignIn/>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/my-profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/create-article" element={<PrivateRoute><ArticleCreationPage /></PrivateRoute>} />
      <Route path="/feed" element={    <PrivateRoute><ArticleFeed /></PrivateRoute>} />
      <Route path="/view-article" element={ <PrivateRoute><ViewArticlePage /></PrivateRoute>} />
      <Route path="/my-articles" element={<PrivateRoute><MyArticles /></PrivateRoute>} />
      <Route path="/select-category" element={<PrivateRoute><CategorySelection/></PrivateRoute>} />
    </Routes>
    </>
  );
}

export default App;

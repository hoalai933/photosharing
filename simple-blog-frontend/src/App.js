
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import About from "./components/About";
import Posts from "./components/Posts";
import PostList from "./components/PostList";
import Post from "./components/Post";
import Login from "./components/Login";
import Stats from "./components/Stats";
import NoMatch from "./components/NoMatch";
import AddPost from "./components/AddPost";

const BACKEND = process.env.REACT_APP_BACKEND_URL || "";

function AppLayout() {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem("sb_user");
    return s ? JSON.parse(s) : null;
  });
  const navigate = useNavigate();

  function onLogin(userObj, token) {
    setUser(userObj);
    localStorage.setItem("sb_user", JSON.stringify(userObj));
    localStorage.setItem("sb_token", token);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("sb_user");
    localStorage.removeItem("sb_token");
    navigate("/");
  }

  return (
    <>
      <nav style={{ margin: 10 }}>
        <Link to="/" style={{ padding: 5 }}>Home</Link>
        <Link to="/posts" style={{ padding: 5 }}>Posts</Link>
        <Link to="/about" style={{ padding: 5 }}>About</Link>
        <span> | </span>
        {user && <Link to="/add" style={{ padding: 5 }}>Add Post</Link>}
        {user && <Link to="/stats" style={{ padding: 5 }}>Stats</Link>}
        {!user && <Link to="/login" style={{ padding: 5 }}>Login</Link>}
        {user && <span onClick={logout} style={{ padding: 5, cursor: "pointer" }}>Logout ({user.username})</span>}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />}>
          <Route index element={<PostList backend={BACKEND} />} />
          <Route path=":id" element={<Post backend={BACKEND} />} />
        </Route>

        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login onLogin={onLogin} backend={BACKEND} />} />
        <Route path="/add" element={ user ? <AddPost backend={BACKEND} /> : <Navigate to="/login" replace /> } />
        <Route path="/stats" element={<Stats user={user} />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

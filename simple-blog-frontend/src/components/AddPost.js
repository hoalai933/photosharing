
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPost({ backend }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  async function handleSubmit() {
    const token = localStorage.getItem("sb_token");
    if (!token) return alert("You must be logged in");
    try {
      const res = await fetch((backend || "") + "/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ title, content })
      });
      if (!res.ok) {
        const err = await res.json();
        return alert(err.message || "Failed");
      }
      const data = await res.json();
      alert("Post created");
      navigate("/posts");
    } catch (e) {
      console.error(e);
      alert("Network error");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Add New Post</h2>
      <div>
        <div>Title</div>
        <input value={title} onChange={e=>setTitle(e.target.value)} />
      </div>
      <div>
        <div>Content</div>
        <textarea value={content} onChange={e=>setContent(e.target.value)} rows={6} cols={40} />
      </div>
      <div style={{marginTop:10}}>
        <button onClick={handleSubmit}>Create</button>
      </div>
    </div>
  );
}


import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PostList({ backend }) {
  const [posts, setPosts] = useState([]);
  const loc = useLocation();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch((backend || "") + "/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [loc, backend]);

  return (
    <div>
      <ul>
        {posts.map(p => (
          <li key={p.id}>
            <Link to={`${p.id}`}><strong>{p.title}</strong></Link>
            <div style={{fontSize:12, color:'#666'}}>{p.author} • {new Date(p.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

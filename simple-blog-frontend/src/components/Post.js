
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Post({ backend }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch((backend || "") + `/api/posts/${id}`);
        if (res.status === 404) {
          setPost({ notFound: true });
          return;
        }
        const data = await res.json();
        setPost(data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [id, backend]);

  if (!post) return <div>Loading...</div>;
  if (post.notFound) return <div>Post not found</div>;

  return (
    <div style={{ padding: 10 }}>
      <h3>{post.title}</h3>
      <div style={{fontSize:12, color:'#666'}}>{post.author} • {new Date(post.createdAt).toLocaleString()}</div>
      <p style={{marginTop:10}}>{post.content}</p>
    </div>
  );
}

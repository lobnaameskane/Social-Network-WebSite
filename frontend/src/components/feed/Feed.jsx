import Share from '../share/share'
import Post from '../post/Post'
import { useEffect, useState } from "react";
import axios from "axios";
import './feed.css';
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("/posts/profile/" + username) // in case we re fetching posts in some user profile.
        : await axios.get("posts/timeline/" + user._id);
      setPosts(
        res.data.sort((post1, post2) => {
          return new Date(post2.createdAt) - new Date(post1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user._id]);

  return (
    <div className="feed">
    <div className="feedWrapper">
    
    {/*displaying share only if the profile is the
    current user profile*/
    (!username || username === user.username) && <Share />}
     {posts.map((p) => (
      <Post key={p._id} post={p}/>
    ))} 
  </div>
  </div>
  );
}

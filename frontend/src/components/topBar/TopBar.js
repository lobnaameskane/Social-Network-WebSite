import "./topBar.css";
import { Search, Person, ChatBubble, Notifications,GroupAdd,Logout } from '@mui/icons-material';
import {Link} from "react-router-dom";
import axios from "axios";
import Post from '../post/Post'
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";



export default function TopBar() {
  const {user,dispatch} = useContext(AuthContext);
  const [searchfield,setsearchfield] = useState("");
  const [searchedPosts,setsearchedPosts] = useState([]);


  const handleChange = e => {
    setsearchfield(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try{ 
      
      const res = await axios.get(`/posts?desc=${searchfield}`);
      console.log(res.data);
      setsearchedPosts(
        res.data.sort((post1, post2) => {
          return new Date(post2.createdAt) - new Date(post1.createdAt);
        })
      );
      
     }
    catch(err){
      console.log(err);
    }
    

  } 

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const logoutCall = async (dispatch) => {
    dispatch({ type: "LOGOUT" });
  };
  const handleLogoutClick = () => {
    logoutCall(
      dispatch
    );
  };

  if (searchfield) {

    return (
      <>
      <div className="topbarContainer">
      <div className="topbarLeft">
      <Link to="/" style={{textDecoration:"none"}}>
        <span className="logo">Social Network</span>
      </Link>

      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <form onSubmit={handleSearch}>
          <input
            placeholder="Friends or posts"
            type="search"
            className="searchInput"
            onChange={handleChange}
          />
          
          </form>
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          
          <Link to="/" style={{textDecoration:"none",color:"white"}}>
          <span className="topbarLink">My Feed</span>
      </Link>
      <Link to="/" style={{textDecoration:"none",color:"white"}}>
          
          <button className="logout" onClick={handleLogoutClick} >Logout</button>
          </Link>

        </div>
        <div className="topbarIcons">
          
          <div className="topbarIconItem">
          <Link to={'/messenger'}>
            <ChatBubble />
          </Link>
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        
        <Link to={`/profile/${user.username}`}>
        <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>

      </div>
    </div>
      <div className="feed">
      <div className="feedWrapper">
      {searchedPosts.map((p) => (
        <Post key={p._id} post={p} className="searchedPost"/>
      ))}
      </div>
      </div>
    </>

    )
  }
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
      <Link to="/" style={{textDecoration:"none"}}>
        <span className="logo">Social Network</span>
      </Link>

      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <form onSubmit={handleSearch}>
          <input
            placeholder="Friends or posts"
            type="search"
            className="searchInput"
            onChange={handleChange}
          />
          
          </form>
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          
          <Link to="/" style={{textDecoration:"none",color:"white"}}>
          <span className="topbarLink">My Feed</span>
      </Link>
      <Link to="/" style={{textDecoration:"none",color:"white"}}>
          
          <button className="logout" onClick={handleLogoutClick} >Logout</button>
          </Link>

        </div>
        <div className="topbarIcons">
          
          <div className="topbarIconItem">
            <ChatBubble />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        
        <Link to={`/profile/${user.username}`}>
        <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>

      </div>
    </div>
  )
    
    

    
    
  
  
    
  
}
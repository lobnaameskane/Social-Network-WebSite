import "./Post.css"
import {MoreHoriz,ThumbUpAlt,Favorite,Send} from "@mui/icons-material";
import { useEffect, useState,useContext } from "react";
import axios from "axios";
import {format} from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Comment from "../comment/Comment";
import AddComment from "../addComment/AddComment";
import {Dropdown} from "react-bootstrap";

export default function Post({post}) {
    const [like,setLike] = useState(post.likes.length);
    const [heart,setHeart] = useState(post.heart.length);
    const [displayComment, setDisplayComment] = useState(false);

    const [isLiked,setIsLiked] = useState(false);
    const [isHearted,setIsHearted] = useState(false);

    const [user,setUser] = useState({});

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser } = useContext(AuthContext);
    //checking if we ve already liked the post.
    useEffect(() => {
      setIsLiked(post.likes.includes(currentUser._id));
    }, [currentUser._id, post.likes]);
    //
    useEffect(() => {
      setIsHearted(post.heart.includes(currentUser._id));
    }, [currentUser._id, post.heart]);
    
    useEffect(() => {
        const fetchUser = async () => {
          const res = await axios.get(`/users?userId=${post.userId}`);
          setUser(res.data);
          
        };
        fetchUser();
      }, [post.userId]); // a dependancy cuz post.userId is changeable.


    const likeHandler =()=>{
      try {
        axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
      } catch (err) {}
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
     }

     

    const heartHandler =()=>{
      try {
        axios.put("/posts/" + post._id + "/heart", { userId: currentUser._id });
      } catch (err) {}
      setHeart(isHearted ? heart - 1 : heart + 1);
      setIsHearted(!isHearted);
     }


     const handleDeletePost = async() => {
      try{
        await axios.delete("/posts/" + post._id, {data: {userId : currentUser._id} });
        window.location.reload();
      }catch(err){
        console.log(err);
      }
    }
    return (
        <div className="post">
            <div className="postWrapper">
                 <div className="postTop">
                     <div className="postTopLeft">
                     <Link to={`/profile/${user.username}`}>
                         <img className="postProfileImg" 
                          src={
                            user.profilePicture
                              ? PF + user.profilePicture
                              : PF + "person/noAvatar.png"
                          }
                          alt=""/>
                          </Link>
                         <span className="postUsername">
                         {user.username}

                         </span>
                         <span className="postDate"> {format(post.createdAt)} </span>
                     </div>
                     {
            user.username==currentUser.username?
              <Dropdown className="dropdown">
                <Dropdown.Toggle  className="toggle" bsPrefix="p-0" id="dropdown-basic">
                  <MoreHoriz htmlColor="black" className="moreHoriz" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleDeletePost}>Delete post</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            :null
          }
                </div>
                <div className="postCenter">
                 <span className="postText">{post?.desc} </span>
                 <img className="postImg" src={PF + post.img} alt=""/> 
                </div>
                <div className="postBottom">
                 <div className="postBottomLeft">
                  <ThumbUpAlt htmlColor='blue' onClick={likeHandler} className="likeIcon"  />
                  <Favorite htmlColor='red' onClick={heartHandler} className="likeIcon" />

                <span className="postLikeCounter">{like} likes, {heart} hearts</span>
            </div>

             <div className="postBottomRight">
                <span className="postCommentText" onClick={()=> setDisplayComment(!displayComment)}>{post.comments.length} comments</span><br /><br />
               
                </div>
                </div>
                {
              displayComment? 
              <div>
                {
                  post.comments.map((c)=><Comment comment={c}/>)}
              <AddComment post={post}/>
              </div>
              :null}
              </div>
              </div>

            
        



    );
}





                     


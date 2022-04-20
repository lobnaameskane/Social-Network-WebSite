import "./Profile.css";
import TopBar from "../../components/topBar/TopBar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState, useContext } from "react";
import axios from "axios"; // to fetch our api
import { useParams } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";

import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'; // get a param from the URI 



export default function Profile() {
    //const Post = require('../../backend/models/Post');
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [coverPic, setcoverFile] = useState(null);
    const [profilPic, setprofileFile] = useState(null);
    const [postsNbr, setpostsNbr] = useState(null);
    const [followersNbr, setfollowersNbr] = useState(null);
    const [followingsNbr, setfollowingsNbr] = useState(null);



    const username = useParams().username;

    useEffect(() => {
      const fetch = async () => {
        const res = await axios.get(`/posts/count/${username}`);
        setpostsNbr(res.data);
        const res2 = await axios.get(`/users/followers/count/${username}`);
        setfollowersNbr(res2.data);
        const res3 = await axios.get(`/users/followings/count/${username}`);
        setfollowingsNbr(res3.data);

      };
      fetch();
    }, [username]);

    
    
    
    

    
    //accessing the username from the URI

    const handleProfil = async (e) => {
      e.preventDefault();
      console.log("clicked")
      
      if (profilPic) {
        const editdata = new FormData();
        console.log(profilPic.name)
        const profileFileName = Date.now() + profilPic.name;
        editdata.append("name", profileFileName);
        editdata.append("file", profilPic);
        const modifiedUser = {
           userId:currentUser._id,                                                                       
           password: currentUser.password,
           profilePicture: profileFileName,
    };
    try {
      axios.post("/upload", editdata);
    } catch (err) {console.log(err)}
    try{
      await axios.put(`/users/${currentUser._id}`, modifiedUser);
      window.location.reload(false); // refreshing the timeline
      
    }
    catch(err){
      console.log(err);
  }
    };}

    const handleCover = async (e) => {
      e.preventDefault();
      console.log("clicked")
      
      if (coverPic) {
        const editdata = new FormData();
        console.log(coverPic.name)
        const coverFileName = Date.now() + coverPic.name;
        editdata.append("name", coverFileName);
        editdata.append("file", coverPic);
        const modifiedUser = {
           userId:currentUser._id,                                                                       
           password: currentUser.password,
           coverPicture: coverFileName,
    };
    try {
      axios.post("/upload", editdata);
    } catch (err) {console.log(err)}
    try{
      await axios.put(`/users/${currentUser._id}`, modifiedUser);
      window.location.reload(false); // refreshing the timeline
      
    }
    catch(err){
      console.log(err);
  }
    };}
   



    useEffect(() => {
      const fetchUser = async () => {
        const res = await axios.get(`/users?username=${username}`);
        setUser(res.data);
      };
      fetchUser();
    }, [username]);


    

    


  
      
    

  return (
    <>

      <TopBar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">


            {user.username == currentUser.username && (
              <>

              <div>
              <img
                className="profileCoverImg"
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "person/noCover.jpg"
                }

                alt=""
              />

              <label htmlFor="coverPic">
              <PhotoCameraIcon className="photoIcon1" />
              <input
                style={{ display: "none" }}
                type="file"
                id="coverPic"
                accept=".png,.jpeg,.jpg"
                onInput={(e) => setcoverFile(e.target.files[0])}
                onChange={handleCover}
                  
              />

              </label>


              </div>


              <div >
              <img
                className="profileUserImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
              
              <label htmlFor="profilPic" >
              <PhotoCameraIcon className="photoIconProfil"/> 
              <input
                style={{ display: "none" }}
                type="file"
                id="profilPic"
                accept=".png,.jpeg,.jpg"
                onInput={(e) => setprofileFile(e.target.files[0])}
                onChange={handleProfil}
    
                
              />

              </label>
             
              </div>
              </>
              )} 


{user.username !== currentUser.username && (
<>
<img
  className="profileCoverImg"
  src={
    user.coverPicture
      ? PF + user.coverPicture
      : PF + "person/noCover.jpg"
  }

  alt=""
/>


<img
  className="profileUserImg"
  src={
    user.profilePicture
      ? PF + user.profilePicture
      : PF + "person/noAvatar.png"
  }
  alt=""
/>
</>
)}


            </div>
            <div className="profileInfo">
                
                <h4 className="profileInfoFollowings">{user.username}</h4>

                <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profilNumbers"> 
            <h6  className="profilNumber">{postsNbr} Posts</h6>
            <h6 className="profilNumber">{followersNbr} Followers</h6>
            <h6 className="profilNumber">{followingsNbr} Followings</h6>
          </div>
          <div className="profileRightBottom">
            <Feed username={username}/> 
            <Rightbar user={user}/>
          </div>
        </div>
      </div>
    </>
  );

  

  
    
    
}

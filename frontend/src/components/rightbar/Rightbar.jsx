import "./rightbar.css";
import AddFriend from "../addFriend/AddFriend";
import {Button} from "react-bootstrap";
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import {Link} from "react-router-dom";
import { useParams,useNavigate } from "react-router";
import Online from "../online/Online";
import { Modal} from 'react-bootstrap';
import React from 'react';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

 // get a param from the URI 






export default function Rightbar({ user }) {
  const newUsername = useRef();
  const newPassword = useRef();
  const email = useRef();
  const description = useRef();
  const profilePicture = useRef();
  const coverPicture = useRef();
  const city = useRef();
  const worksAt = useRef();
  const birthdate = useRef();
  const navigate = useNavigate(); 
  const confNewPassword = useRef();


  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const username = useParams().username;
  const [show, setShow] = useState(false);
  const [coverPic, setcoverFile] = useState(null);
  const [profilPic, setprofileFile] = useState(null);
  const [users, setUsers] = useState([]);

  const editCall = async (dispatch) => {
    dispatch({ type: "EDIT" });
  };
  const logoutCall = async (dispatch) => {
    dispatch({ type: "LOGOUT" });
  };



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [friends, setFriends] = useState([]);
  const [photosArray, setPhotos] = useState([]);

  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.following.includes(user?._id)
  );

  
  //get the user photos from his posts 
  useEffect(() => {
    const getPhotos = async () => {
      try {
        const postArray = (await axios.get("/posts/profile/" + username)).data;
        const photoArray=[];
        
        postArray.forEach((item, index)=>{
          item.img && photoArray.push(item.img);
        });
        setPhotos(photoArray);
        console.log(photosArray)
      } catch (err) {
        console.log(err);
      }
    };
    getPhotos();
  }, [username]);
  



  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendArray = await axios.get("/users/friends/" + user._id);
        setFriends(friendArray.data);
        console.log(friends);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersList = await axios.get("/users/all");
        setUsers(usersList.data.filter((userr) => (!userr.followers.includes(currentUser._id)) && (userr._id!==currentUser._id)))
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, [currentUser]);

  //submitting edit form

  const handlingClick = async (e)=>{
    e.preventDefault();

    console.log("clicked");
      
      console.log(confNewPassword.current.value);

      if ( confNewPassword.current.value !== newPassword.current.value){
        //confNewPassword.current.setCustomValidity("Passwords aren't matching!");
        toast.warning("Passwords aren't matching", {autoClose:3500})
      }
      else{ 
        const modifiedUser = {
          userId:currentUser._id,
          username: newUsername.current.value ? newUsername.current.value : currentUser.username,                                                                       
          email: email.current.value ? email.current.value : currentUser.email,
          password: newPassword.current.value === "" ? currentUser.password : newPassword.current.value ,
          desc: description.current.value ===""? currentUser.desc : description.current.value ,
          city: city.current.value ==="" ?  currentUser.city : city.current.value,
          worksAt:worksAt.current.value === "" ? currentUser.worksAt : worksAt.current.value ,
          birthDate:birthdate.current.value,
  
        };
      
      
      try{
        await axios.put(`/users/${currentUser._id}`, modifiedUser);
        logoutCall(
          dispatch
        );
        navigate("/"); 
        window.location.reload(false);
        toast.success('Profil has been updated successfully,You should login again', {autoClose:5500})
        console.log(modifiedUser);
  
      }catch(err){
        console.log(err);
    }}
  }
  

    
  
                                                                                  
  
  const handleFollowClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
    }
  };
  
  const HomeRightbar = () => {
    return (
      <>
        <div className="addContainer">
          <h4 className="rightbarTitle">Expand your network</h4>
          <ul className="rightbarFriendList">
          {users.map((u) => (
              <AddFriend key={u.id} user={u}/>
            ))}
        </ul>
        </div>
        
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    

    return (
      <>
      {user.username == currentUser.username && (
        
        <>
        
          <Button variant="outline-secondary"  onClick={handleShow}>
          Edit my profile
        </Button>
        
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Your Profile</Modal.Title>
          </Modal.Header>

          <Modal.Body>

          <form className="editBox" onSubmit={handlingClick}>
            <center>
            <input placeholder="Username"  ref={newUsername} className="editInput" /><br />
            <input type= "password" placeholder="New Password"  ref={newPassword} className="editInput" /><br />
            <input type= "password" placeholder="Confirm New Password"  ref={confNewPassword} className="editInput" /><br />


            <input placeholder="Email"  type="email" ref={email} className="editInput" /><br />
            <textarea placeholder="Description"  type="text" ref={description} className="editInput" /><br />
            


            <input placeholder="City"   ref={city} className="editInput" /><br />
            <input placeholder="Studies at"   ref={worksAt} className="editInput" /><br />

            <input placeholder="Works at"   ref={worksAt} className="editInput" /><br />
            
            <span className="editSpan">Birth Date</span><br />
            
            <input placeholder="BirthDate"  type="date" ref={birthdate} className="editInput" /><br />
            
            <button className="saveButton" type="submit">Save changes</button><br />
            <span className="span">When submitting changes you will be redirected to Login Page.</span>
            </center>


          </form> 
          </Modal.Body>

          
        </Modal>
        </>
        )}
        
          
         
      
      {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleFollowClick}>
            {followed ? "Unfollow" : "Follow"}
            
          </button>
        )}
        

        <h4 className="rightbarTitle">About User</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          { user.from && (<div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>)}
          { user.birthDate && (<div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Date of Birth:</span>
            <span className="rightbarInfoValue">{user.birthDate.split('T')[0]}</span>
          </div>)}
          {user.worksAt  && (  
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Works at :</span>
            <span className="rightbarInfoValue">{user.worksAt}</span>
          </div>)}
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user.relationship === 1
                ? "Single"
                : user.relationship === 2
                ? "Married"
                : "-"}</span>
          </div>
        </div>
        

        <div>
        <h4 className="rightbarTitle">Photos</h4>
        <div className="rightbarFollowings">
        {photosArray.map((photo) => (
          
          <div className="rightbarImage">
            <img
              src={PF + photo}             
              alt=""
              className="rightbarFollowingImg"
            />
          </div>))}
          </div>

        

        </div>
        <h4 className="rightbarTitle">Friends</h4>
        <div className="rightbarFollowings">
        {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}


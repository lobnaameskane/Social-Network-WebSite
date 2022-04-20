import "./addFriend.css";
import {axios} from "axios";
import {Link} from "react-router-dom";
import {useState, useContext} from "react";
import { AuthContext } from "../../contexts/AuthContext";
export default function AddFriend({user}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.following.includes(user?.id)
  );
  const handleClickFollow = async () => {
    
    try {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        console.log(user._id,currentUser._id);
        dispatch({ type: "FOLLOW", payload: user._id });
        setFollowed(!followed);
    } catch (err) {
      console.log(err);
    }
    
  };

  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
      <Link to={`/profile/${user.username}`} style={{textDecoration:"none",color:"white"}}>

        <img className="rightbarProfileImg" src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "person/noAvatar.png"
                  } alt="" />
      </Link>

      </div>
      <span className="rightbarUsername">{user.username}</span>
      <div className="rightAline">
          <button className="addFriendButton" onClick={handleClickFollow}>+Follow</button>
      </div>
    </li>
  );
}
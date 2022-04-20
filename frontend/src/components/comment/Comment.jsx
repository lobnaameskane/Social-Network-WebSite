import "./comment.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Comment({comment}){
    const [user, setUser] = useState({});
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        const fetchUser = async () => {
          const res = await axios.get(`/users?userId=${comment.userId}`);
          setUser(res.data);
        };
        fetchUser();
      }, []);
    
    return(<>
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${user.username}`}>
                            <img
                                className="postProfileImg"
                                src={
                                    user.profilePicture
                                    ? PF + user.profilePicture
                                    : PF + "person/noAvatar.png"
                                }
                                alt=""
                            />
                        </Link>
                        <span className="postUsername">{user.username}</span>
                        <div className="textToTime">{comment.text}</div>
                    </div>
                    <span className="postBottomRight">{format(comment.date)}</span>
                </div>
            </div>
        </div>
        </>
    );
}
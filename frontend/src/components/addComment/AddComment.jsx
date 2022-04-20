import "./addComment.css"
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

export default function AddComment({post}){
    const [user, setUser] = useState({});
    const [comments, setComments] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser } = useContext(AuthContext);
    const text = useRef();

    const submitHandler = async (e) => {
        e.preventDefault();
        try{
            await axios.post("/posts/" + post._id +"/comment",{userId: currentUser._id, text: text.current.value });
            window.location.reload();
        }catch (err){}
    }

    return(<>
    <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <form onSubmit={submitHandler} className="form-inline d-flex justify-content-between">
                            <div className="form-group mx-sm-3 mb-2" >
                            <img
                                className="postProfileImg"
                                src={
                                    currentUser.profilePicture
                                    ? PF + currentUser.profilePicture
                                    : PF + "person/noAvatar.png"
                                }
                                alt=""
                            />
                                <input className="form-control-add" id="exampleInputEmail1" type="text" placeholder='Add a comment' ref={text}></input>
                            </div>
                            <button type="submit" className="commentBtn">Comment</button>
                        </form>
                    </div>
                </div>
            </div>
    </div>
    

    </>
    );
}
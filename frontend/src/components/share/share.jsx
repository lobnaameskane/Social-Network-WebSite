import "./share.css";
import {PermMedia, Label,Room, Mood,Event,Cancel} from "@mui/icons-material"
import { useContext,useRef,useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import {Link} from "react-router-dom";


export default function Share() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const postCaption = useRef();
  const [file, setFile] = useState(null);

  //trigerred with the share button
  const postSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: postCaption.current.value,
    };
    if (file) {
      const postdata = new FormData();
      const fileName = Date.now() + file.name;
      postdata.append("name", fileName);
      postdata.append("file", file);
      newPost.img = fileName;
      console.log(newPost);
      try {
        /*await*/axios.post("/upload", postdata);
      } catch (err) {console.log(err)}
    }
    try {
      await axios.post("/posts", newPost);
      window.location.reload(false); // refreshing the timeline
    } catch (err) {console.log(err)}
  };

  



  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
        <Link to={`/profile/${user.username}`}>
          <img className="shareProfileImg" src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            } alt="" />
        </Link>
            
          <input
            placeholder={"What's on your mind " + user.username + "?"}
            className="shareInput"
            ref={postCaption}
          />
        </div>
        <hr className="shareHr"/>
        {file && (
          <div className="imgDiv">
            <img className="sharepostImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="cancelShare" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={postSubmit} >
            <div className="shareOptions">
                <label htmlFor="file" className="shareOption">
                    <PermMedia htmlColor="red" className="shareIcon"/>
                    <span className="shareOptionText">Media</span>
                    <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
                </label>
                
                <div className="shareOption">
                    <Room htmlColor="blue" className="shareIcon"/>
                    <span className="shareOptionText">Location</span>
                </div>
                <div className="shareOption">
                    <Event htmlColor="#FBC02D" className="shareIcon"/>
                    <span className="shareOptionText">Event</span>
                </div>
                <div className="shareOption">
                    <Label htmlColor="green" className="shareIcon"/>
                    <span className="shareOptionText">Tag</span>
                </div>
                <div className="shareOption">
                    <Mood htmlColor="rebeccapurple" className="shareIcon"/>
                    <span className="shareOptionText">Emotions</span>
                </div>
            </div>
            <button className="shareButton" type="submit">Share</button>
        </form>
      </div>
    </div>
  );
}
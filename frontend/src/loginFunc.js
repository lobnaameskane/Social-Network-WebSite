import axios from "axios";
//import { useDispatch } from 'react-redux';




export const loginFunc = async (userCredential, dispatch) => {
    //const dispatch = useDispatch();
    dispatch({ type: "LOGIN_START" });
    axios.post("/auth/login", userCredential)
    .then((res) => {
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    })
    .catch((error) => {
      dispatch({ type: "LOGIN_FAILURE", payload: error });
      if (error.response.data === "user not found") {
        console.log(error.response.data);
      }
      if (error.response.data === "wrong password") {
        console.log(error.response.data);
      }

    });
      }
    
  
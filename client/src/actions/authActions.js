import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { AUTH_LOADING, GET_ERRORS, SET_CURRENT_USER } from "./types";

//Register User
export const registerUser = (userData, history) => (dispatch) => {
  dispatch(setAuthLoading(true));

  axios
    .post("/api/users/register", userData)
    .then((res) => {
      dispatch(setAuthLoading(false));
      history.push("/login");
    })
    .catch((err) => {
      dispatch(setAuthLoading(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//Login - Get user token
export const loginUser = (userData) => (dispatch) => {
  dispatch(setAuthLoading(true));
  axios
    .post("/api/users/login", userData)
    .then((res) => {
      //Save to local storage
      const { token } = res.data;
      //Set token to local storage
      localStorage.setItem("jwtToken", token);
      //Set token to Auth header
      setAuthToken(token);
      //Decode token to get user data
      const decoded = jwt_decode(token);
      //Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) => {
      dispatch(setAuthLoading(false));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

//Log user out
export const logoutUser = () => (dispatch) => {
  //Remove token from local storage
  localStorage.removeItem("jwtToken");
  //Remove auth header for future request
  setAuthToken(false);
  //Set current user to an empty object which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

//Set auth loading
export const setAuthLoading = (loading) => {
  return {
    type: AUTH_LOADING,
    payload: loading,
  };
};

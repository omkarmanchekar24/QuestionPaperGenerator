import axios from "axios";
import {
  GET_PROFILE,
  CLEAR_CURRENT_PROFILE,
  PROFILE_LOADING,
  PROFILE_NOT_FOUND,
  SET_CURRENT_USER,
  GET_ERRORS,
  UPLOAD_PICTURE,
} from "../actions/types";

//Get current profile
export const getCurrentProfile = () => {
  return (dispatch) => {
    dispatch(setProfileLoading());

    axios
      .get("/api/profiles")
      .then((res) =>
        dispatch({
          type: GET_PROFILE,
          payload: res.data,
        })
      )
      .catch((err) => {
        dispatch({
          type: GET_PROFILE,
          payload: {},
        });
      });
  };
};

//Create Profile
export const createProfile = (profileData, history) => (dispatch) => {
  axios
    .post("/api/profiles", profileData)
    .then((res) => history.push("/dashboard"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

//Add experience
export const addExperience = (expData, history) => (dispatch) => {
  axios
    .post("/api/profiles/experience", expData)
    .then((res) => history.push("/dashboard"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

//Add education
export const addEducation = (eduData, history) => (dispatch) => {
  axios
    .post("/api/profiles/education", eduData)
    .then((res) => history.push("/dashboard"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

//Delete an experience
export const deleteExperience = (id) => (dispatch) => {
  axios
    .delete(`/api/profiles/experience/${id}`)
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

//Delete an education
export const deleteEducation = (id) => (dispatch) => {
  axios
    .delete(`/api/profiles/education/${id}`)
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

//Delete account and profile
export const deleteAccount = () => (dispatch) => {
  if (window.confirm("Are you sure? This can not be undone!")) {
    axios
      .delete("/api/profiles")
      .then((res) =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {},
        })
      )
      .catch((err) =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        })
      );
  }
};

//Profile Loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING,
  };
};

//Clear Profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};

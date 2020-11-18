/* eslint-disable import/no-anonymous-default-export */
import {
  SET_CURRENT_USER,
  AUTH_LOADING,
  UPLOAD_PICTURE,
  UPLOAD_PICTURE_FAILED,
  REMOVE_PICTURE,
  SHOW_MODAL,
  HIDE_MODAL,
} from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
  showModal: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        loading: false,
      };
    case UPLOAD_PICTURE:
      return {
        ...state,
        user: { ...state.user, cloudinary: action.payload },
        loading: false,
        showModal: false,
      };
    case UPLOAD_PICTURE_FAILED:
      return {
        ...state,
        loading: false,
        showModal: false,
      };
    case REMOVE_PICTURE:
      return {
        ...state,
        user: {
          ...state.user,
          cloudinary: null,
        },
      };
    case SHOW_MODAL:
      return {
        ...state,
        showModal: true,
      };
    case HIDE_MODAL:
      return {
        ...state,
        showModal: false,
      };
    default:
      return state;
  }
};

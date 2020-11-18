/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import isEmpty from "../../validation/is-empty";
import { connect } from "react-redux";
//import { clearCurrentProfile } from "../../actions/profileActions";
import { Modal, Button } from "react-bootstrap";
import defaluserLogo from "../../assets/images/user1.png";
import ImageUploader from "react-images-upload";
// import ImageUploading from "react-images-uploading";
//import TextFieldGroup from "../common/TextFieldGroup";
import Spinner from "../common/Spinner";

//Actions
import {
  changeProfilePicture,
  removeProfilePicture,
  loginUser,
  logoutUser,
  showModal,
  hideModal,
} from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";

function MydModalWithGrid(props) {
  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      size="lg"
      centered
      animation={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>Upload Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ImageUploader
          withIcon={true}
          buttonText="Choose image"
          onChange={props.onChange}
          imgExtension={[".jpg", ".gif", ".png", ".gif"]}
          maxFileSize={5242880}
          singleImage={true}
          withPreview
        />
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: "center" }}>
        {props.loading ? (
          <Spinner />
        ) : (
          <>
            <Button variant="secondary" onClick={props.onHide}>
              Close
            </Button>
            <Button variant="primary" onClick={props.onSave}>
              Save Changes
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

class Navbar extends Component {
  state = {
    show: false,
    pictures: [],
    image: [],
    errors: {},
    loading: false,
  };

  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  onChange(picture) {
    this.setState({
      image: this.state.pictures.concat(picture),
    });
  }

  onSave = () => {
    if (this.state.image.length === 0) {
      alert("Please select an image");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.state.image[0]);
    reader.onloadend = () => {
      this.props.changeProfilePicture(reader.result);
    };
    reader.onerror = () => {
      console.error("AHHHHHHHH!!");
    };
  };

  toggleModal = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  static getDerivedStateFromProps(nextProps, nextState) {
    console.log(nextProps);
    if (nextProps.auth.loading) {
      return { loading: true };
    } else {
      return { loading: false };
    }
  }

  render() {
    const { isAuthenticated, user, showModal } = this.props.auth;

    // console.log(this.state);
    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/feed">
            Post Feed
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>

        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle rounded-circle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img
              className="rounded-circle"
              src={
                !isEmpty(user.cloudinary) ? user.cloudinary.url : defaluserLogo
              }
              alt={user.name}
              style={{ width: "30px", height: "30px", marginRight: "5px" }}
              title="You must have a Gravatar connected to your email to display an image"
            />
          </a>

          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a
              class="dropdown-item"
              href="#"
              onClick={() => this.props.showModal()}
            >
              {!isEmpty(user.cloudinary)
                ? "Change Profile Picture"
                : "Upload Profile Picture"}
            </a>
            {!isEmpty(user.cloudinary) ? (
              <>
                <a
                  class="dropdown-item"
                  href="#"
                  onClick={() =>
                    this.props.removeProfilePicture(user.cloudinary.public_id)
                  }
                >
                  Remove Profile Picture
                </a>
                <div class="dropdown-divider"></div>
              </>
            ) : null}
            <a class="dropdown-item" href="#">
              Account Settings
            </a>
            <div class="dropdown-divider"></div>
            <a
              class="dropdown-item"
              href="#"
              onClick={this.onLogoutClick.bind(this)}
            >
              Logout
            </a>
          </div>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <>
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
          <div className="container">
            <Link className="navbar-brand" to="/">
              Question Paper Generator
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#mobile-nav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="mobile-nav">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/profiles">
                    Generators
                  </Link>
                </li>
              </ul>

              {isAuthenticated ? authLinks : guestLinks}
            </div>
          </div>
        </nav>
        <MydModalWithGrid
          show={showModal}
          onChange={this.onChange.bind(this)}
          onHide={this.props.hideModal}
          onSave={this.onSave.bind(this)}
          loading={this.state.loading}
        />
      </>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, {
  loginUser,
  logoutUser,
  changeProfilePicture,
  clearCurrentProfile,
  removeProfilePicture,
  showModal,
  hideModal,
})(Navbar);

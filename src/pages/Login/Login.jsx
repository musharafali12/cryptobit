import { useContext, useState, useEffect } from "react";
import "./Login.css";
import sideImg from "./side-image.png";
import { Formik, Form, Field } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../contextAPI/contextAPI";
import Loader from "../Loader/loader";

let Login = () => {
  let navigate = useNavigate();
  //state show loader on clicking login button
  let [showLoader, setShowLoader] = useState(false);
  let loading_text = "logging in";

  //Redirect to dashboard if logged in
  let storedUserString = localStorage.getItem("user");
  let storedUser = JSON.parse(storedUserString);
  let auth = storedUser;
  useEffect(() => {
    if (auth) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <>
      <div className="login-container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div className="left-side">
                <img src={sideImg} width="90%" alt="" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="right-side">
                <Formik
                  initialValues={{ username: "", password: "" }}
                  onSubmit={async (values, { resetForm }) => {
                    try {
                      setShowLoader(true);
                      let response = await fetch(
                        "http://localhost:1000/login",
                        {
                          method: "post",
                          body: JSON.stringify(values),
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      );

                      let getResponse = await response.json();
                      console.log(getResponse);

                      // store response data in local storage

                      if (getResponse.message == "Invalid Username") {
                        alert("Invalid Username");
                        setShowLoader(false);
                      } else if (getResponse.message == "Invalid Password") {
                        alert("Invalid Password");
                        setShowLoader(false);
                      }
                      if (getResponse.auth) {
                        setShowLoader(false);
                        localStorage.setItem(
                          "user",
                          JSON.stringify(getResponse)
                        );
                        navigate("/dashboard");
                      }
                      console.log(getResponse.message);

                      if (getResponse) {
                        console.log(`Network responded with:${getResponse}`);
                      } else {
                        throw Error("Network response was not ok");
                      }

                      //reset form data
                      resetForm();
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  {!showLoader ? (
                    <Form>
                      <div className="form-heading">
                        <h1>Login to Your CryptoBit Accout</h1>
                      </div>
                      <div className="username-name">
                        <div className="username">
                          <i class="fa-solid fa-user"></i>
                          <Field
                            name="username"
                            type="text"
                            placeholder="Username"
                          />
                        </div>
                      </div>
                      <div className="password-container">
                        <div className="password">
                          <i class="fa-solid fa-lock"></i>
                          <Field
                            name="password"
                            type="password"
                            placeholder="Password"
                          />
                        </div>
                      </div>
                      <div className="submit-btn">
                        <button type="submit">Login Now</button>
                      </div>
                    </Form>
                  ) : (
                    <Loader loading_text={loading_text} />
                  )}
                </Formik>
                <div className="create-account">
                  <p>
                    Don't have an account? <Link to="/register">Sign Up</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

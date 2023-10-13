import { useContext, useEffect, useState } from "react";
import "./register.css";
import sideImg from "./side-image.png";
import { Formik, Form, Field } from "formik";
import { Context } from "../../contextAPI/contextAPI";
import { Link, useNavigate } from "react-router-dom";
import Loader from '../Loader/loader';

let Register = () => {
  //set loader
  let [spinner, setSpinner] = useState(false);
  let loading_text = 'Signing up';
  //Redirect to dashboard if registered or logged in
  let navigate = useNavigate();
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
      <div className="register-container">
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
                  initialValues={{
                    username: "",
                    name: "",
                    email: "",
                    password: "",
                    confirmpassword: "",
                  }}
                  onSubmit={async (values, { resetForm }) => {
                    
                    if (values.username == "") {
                      alert("Username can't be empty");
                    } else if (values.name == "") {
                      alert("Name field is required");
                    } else if (values.email == "") {
                      alert("Provide a valid email address");
                    } else {
                      try {
                        setSpinner(true);
                        let response = await fetch(
                          "http://localhost:1000/register",
                          {
                            method: "post",
                            body: JSON.stringify(values),
                            headers: {
                              "Content-Type": "application/json",
                            },
                          }
                        );

                        let getResponse = await response.json();
                        
                        if (getResponse.message) {
                          alert(getResponse.message);
                          setSpinner(false);
                        }
                        console.log(getResponse)

                        //Navigate user to home page if logged in

                        if (getResponse.message == "Username  already exists") {
                          alert("Username  already exists");
                        } else if (
                          getResponse.message == "Email  already exists"
                        ) {
                          alert("Email  already exists");
                        }

                        

                        //reset form data
                        resetForm();
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  }}
                >
                  {
                    !spinner ?
                    <Form>
                    <div className="form-heading">
                      <h1>Register with CryptoBit Now!</h1>
                    </div>
                    <div className="username-name">
                      <div className="username">
                        <i class="fa-solid fa-user"></i>
                        <Field
                          name="username"
                          type="text"
                          placeholder="Username *"
                        />
                      </div>
                      <div className="name">
                        <i class="fa-solid fa-user"></i>
                        <Field name="name" type="text" placeholder="Name" />
                      </div>
                    </div>
                    <div className="email-container">
                      <i class="fa-solid fa-envelope"></i>
                      <Field
                        name="email"
                        type="text"
                        placeholder="Email Address *"
                      />
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
                      <div className="confirm-password">
                        <i class="fa-solid fa-lock"></i>
                        <Field
                          name="confirmpassword"
                          type="password"
                          placeholder="Confirm Password"
                        />
                      </div>
                    </div>
                    <div className="submit-btn">
                      <button type="submit">Register Now</button>
                    </div>
                  </Form>
                  :
                  <Loader loading_text = {loading_text} />
                  }
                </Formik>
                <div className="sign-in">
                  <p>
                    Already have an account ? <Link to="/login">Login Now</Link>
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

export default Register;

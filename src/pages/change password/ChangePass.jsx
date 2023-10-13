import { Field, Formik, Form } from "formik";
import "./ChangePass.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { Context } from "../../contextAPI/contextAPI";


let ChangePass = () => {

  let {setProImgUrl} = useContext(Context)

  let fetchProImg =async ()=>{
    let response = await fetch(`http://localhost:1000/fetchProImg/${storedUser.user._id}`);
    response =  await response.json();
    setProImgUrl(`http://localhost:1000/images/${response.imageUrl.generatedImgName}`);
  }

  useEffect(()=>{
    
    fetchProImg();
    
  },[]);

    //Redirect to dashboard if logged in
    let navigate = useNavigate();
  let storedUserString = localStorage.getItem('user');
  let storedUser = JSON.parse(storedUserString);
  let auth = storedUser;
  useEffect(()=>{
      if(!auth){
          navigate('/login');
          }
  },[]);

  return (
    <>
      <div className="change-pass-container">
        <Formik initialValues={{password:'', newPassword:''}}
        onSubmit={
            async (values, {resetForm})=>{

                let userId = auth.user._id;
                let passwordInfo = {
                    userId:userId,
                    password:values.password,
                    newPassword:values.newPassword,
                }

                let response = await fetch('http://localhost:1000/changepassword',{
                    method:'POST',
                    body:JSON.stringify(passwordInfo),
                    headers:{
                        'Content-Type':'application/json'
                    }
                });

                response = await response.json();
                resetForm();
                alert(response.message)

            }
        }

        >
          <Form>
          <div className="old-pass-container">
            <label htmlFor="">Enter old password:</label>
            <Field name = 'password' type="password" placeholder="Old Password" />
          </div>
          <div className="new-pass-container">
            <label htmlFor="">Enter new password:</label>
            <Field name = 'newPassword' type="password" placeholder="New Password" />
          </div>
          <div className="submit-btn">
            <button type="submit">Change Password</button>
          </div>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default ChangePass;

import { useNavigate, useParams } from "react-router-dom";
import "./register.css";
import { useEffect, useState } from "react";

let Verification = () => {
    let navigate = useNavigate();
  let [verificationMessage, setVerificationMessage] = useState();
  //state for countdown
  let [countdown, setCountDown] = useState(5);

  let { token } = useParams();
  useEffect(() => {
    let verificationRequest = async () => {
      try {
        let response = await fetch(`http://localhost:1000/verify/${token}`);
        response = await response.json();
        if (response.message === 'Your Email Address has been verified.') {
          setVerificationMessage(response.message);
          console.log(response)
          //set user to local storage
          localStorage.setItem('user', JSON.stringify(response));
        }
        else if(response.message === 'You have already verified your account'){
          setVerificationMessage(response.message)
          console.log(verificationMessage)
        }
      } catch (error) {
        alert(error);
      }
    };

    verificationRequest();
  }, [token]);

  //countdown function
  let timeLapse = ()=>{
    setCountDown(countdown-1)
  }

  if(verificationMessage){
    let intervalId = setInterval(()=>{
      timeLapse();
    },2000);

    if(countdown === 0){
      clearInterval(intervalId);
    }
  }

  useEffect(()=>{
    setTimeout(() => {
        navigate('/dashboard')
    }, 5000);
  },[verificationMessage]);

  return (
    <>
      <section className="verification-container">
        {
            !verificationMessage ?
            <div className="before-verification">
          <p className="title">Verifying your email address...</p>
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        </div>
        :
        <div className="after-verification">
          <p className="title">{verificationMessage && verificationMessage}</p>
          <p className="message">
            You're being redirected to your account dashboard... <span>{countdown}</span>
          </p>
          <div className="verified-icon">
            <div className="icon">
              <i class="fa-solid fa-check"></i>
            </div>
          </div>
        </div>
        }
        
      </section>
    </>
  );
};

export default Verification;

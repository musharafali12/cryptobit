import { useContext, useEffect, useState } from "react";
import "./profile.css";
import { Context } from "../../contextAPI/contextAPI";
import { json, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Loader from "../Loader/loader";
let imgUrls = require("./imgUrls");

let Profile = () => {
  let { setName, setEmail, setProImgUrl, loadProImg, setLoadProImg } = useContext(Context);
  let storedUserString = localStorage.getItem("user");
  let storedUser = JSON.parse(storedUserString);
  let navigate = useNavigate();
  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
    } else if (storedUser.user) {
      if (storedUser.user.name && storedUser.user.email) {
        setName(storedUser.user.name);
        setEmail(storedUser.user.email);
      }
    }
  }, []);

  //open file input on clicking image
  let openFileInput = () => {
    document.getElementById("fileInput").click();
  };

  //state for storing img data url for preview
  let [imgPreview, setImgPreview] = useState();
  let [imgFile, setImgFile] = useState();
  let [imgUrl, setImgUrl] = useState();
  let [saveCancelBtn, setSaveCancelBtn] = useState(false);

  let handleImgPreview = (e) => {
    let file = e.target.files[0];
    //set file in imgFile to send in API
    setImgFile(file);

    if (file) {
      let fileReader = new FileReader();
      fileReader.onload = (event) => {
        let dataUrl = event.target.result;
        setImgPreview(dataUrl);
        setSaveCancelBtn(true)
      };
      fileReader.readAsDataURL(file);
    }
  };

  let handleImgUpload =async ()=>{
    if(imgFile){
      let formData = new FormData();
      formData.append('pro-image',imgFile);
      let storedUser = JSON.parse(localStorage.getItem('user'));
      try {
        let response = await fetch(`http://localhost:1000/uploadimage/${storedUser.user._id}`,{
          method:'POST',
          body: formData,
        });

        response = await response.json();
        if(response){
          setSaveCancelBtn(!saveCancelBtn)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  //fetch profile image
  let fetchProImg =async ()=>{
    let response = await fetch(`http://localhost:1000/fetchProImg/${storedUser.user._id}`);
    response =  await response.json();
    console.log(response)
    setImgUrl(response.imageUrl);
    setImgPreview(`http://localhost:1000/images/${response.imageUrl.generatedImgName}`);
    setProImgUrl(`http://localhost:1000/images/${response.imageUrl.generatedImgName}`);
  }

  useEffect(()=>{
    
    fetchProImg();
    
  },[]);

  let retainPreviousImgOnCancel = ()=>{
    fetchProImg();
    setSaveCancelBtn(!saveCancelBtn);
  }


  //Toggle crypto balance viewer
  let [CryptoBalanceViewer, setCryptoBalanceViewer] = useState(false);
  let [viewCryptoBalance, setViewCryptoBalance] = useState();
  let cryptoBalanceToggler = async () => {
    setCryptoBalanceViewer(!CryptoBalanceViewer);
    //Fetch crypto balance
    let storedUserString = localStorage.getItem("user");
    let storedUser = JSON.parse(storedUserString);
    let userId = storedUser.user._id;

    let response = await fetch(
      `http://localhost:1000/purchasedcrypto/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response) {
      response = await response.json();
      console.log(`current crypto balance:${response}`);
      setViewCryptoBalance(response);
    } else {
      alert("failed to load your crypto balance");
    }
  };

  //Account deletion functtion
  let [toggleDeleteWindow, setToggleDeleteWindow] = useState(false);
  let [toggleSpinner, setToggleSpinner] = useState(false);
  let loading_text = "deleting";

  let toggleDeleteModelWindow = () => {
    setToggleDeleteWindow(!toggleDeleteWindow);
  };

  let processAccountDeletion = async () => {
    setToggleSpinner(true);
    setToggleDeleteWindow(!toggleDeleteWindow);
    let storedUserString = localStorage.getItem("user");
    let storedUser = JSON.parse(storedUserString);
    let userId = storedUser.user._id;

    let response = await fetch("http://localhost:1000/deleteaccount", {
      method: "DELETE",
      body: JSON.stringify({ userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      response = await response.json();
      setToggleSpinner(false);
      alert(response.message);
      localStorage.clear();
      navigate("/register");
    }
  };

  return (
    <>
      {toggleSpinner ? (
        <Loader loading_text={loading_text} />
      ) : (
        <div className="profile-main">
          <div className="profile-container">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-4 col-md-12">
                  <div className="profile-left-side">
                    <div className="profile-img-container">
                      <form action="/upload" method="post" enctype="multipart/form-data">
                      <input
                        onChange={handleImgPreview}
                        type="file"
                        id="fileInput"
                        style={{ visibility: "hidden" }}
                      />
                      </form>
                      <div className="profile-img">
                        <img
                          src={imgPreview ? imgPreview : imgUrls.Bitcoin}
                          width="100px"
                          height="100px"
                          alt=""
                        />
                        <div
                          onClick={openFileInput}
                          className="profile-img-overlay"
                        >
                          <i class="fa-light fa-camera"></i>
                        </div>
                      </div>
                    </div>
                    {
                      saveCancelBtn ?
                      <div className="img-upload-btn">
                      <button onClick={handleImgUpload} className="save-btn">Save</button>
                      <button onClick={retainPreviousImgOnCancel} className="cancel-button">Cancel</button>
                    </div>
                    :
                    ''
                    }
                    <p className="name">Musharaf Ali</p>
                    <div className="profile-details">
                      <div className="profile-username">
                        <div className="left-border"></div>
                        <div>
                          <p className="key">User Name</p>
                          <p className="value">{storedUser.user.username}</p>
                        </div>
                      </div>
                      <div className="profile-name">
                        <div className="left-border"></div>
                        <div>
                          <p className="key">Name</p>
                          <p className="value">{storedUser.user.name}</p>
                        </div>
                      </div>
                      <div className="profile-email">
                        <div className="left-border"></div>
                        <div>
                          <p className="key">Email Address</p>
                          <p className="value">{storedUser.user.email}</p>
                        </div>
                      </div>
                      <div className="profile-pass-change">
                        <Link to="/changepassword">
                          <button>Change Password</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12">
                  <section className="profile-right-side">
                    <div className="profile-heading">
                      <h1>My Profile</h1>
                    </div>
                    <div className="view-market">
                      <div className="icon">
                        <i class="fa-solid fa-shop"></i>
                      </div>
                      <div className="description">
                        <div className="key-value">
                          <p className="key">View Market Data</p>
                          <p className="value">
                            Visit and see the current market situation, such as
                            current crypto price, 24H price change, market cap
                            etc.
                          </p>
                        </div>
                        <div className="button-container">
                          <button>
                            <Link to="/pricing">View</Link>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="view-watchlist">
                      <div className="icon">
                        <i class="fa-solid fa-shop"></i>
                      </div>
                      <div className="description">
                        <div className="key-value">
                          <p className="key">View Watchlist</p>
                          <p className="value">
                            Visit and observe the cryptocurrencies you have
                            added in your watchlist
                          </p>
                        </div>
                        <div className="button-container">
                          <button>
                            <Link to="/watchlistpage">View</Link>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="view-bought-currencies">
                      <div className="icon">
                        <i class="fa-solid fa-shop"></i>
                      </div>
                      <div className="description">
                        <div className="key-value">
                          <p className="key">Crypto Account Balance</p>
                          <p className="value">
                            Visit and see the cryptocurrencies you have
                            purchased for trading.
                          </p>
                        </div>
                        <div
                          onClick={cryptoBalanceToggler}
                          className="button-container"
                        >
                          <button>
                            <Link>View</Link>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="account-deletion">
                      <div className="icon">
                        <i class="fa-solid fa-shop"></i>
                      </div>
                      <div className="description">
                        <div className="key-value">
                          <p className="key">Delete Your Account</p>
                          <p className="value">
                            Please note that deleting your will permanently
                            delete your data. Once deleted, your account won't
                            be recovered back.
                          </p>
                        </div>
                        <div className="button-container">
                          <button onClick={toggleDeleteModelWindow}>
                            <Link>Delete</Link>
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
          {toggleDeleteWindow ? (
            <>
              <div onClick={toggleDeleteModelWindow} className="overlay"></div>
              <div className="deletion-box-container">
                <div className="deletion-box">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="del-confirm-text">
                          <p>
                            Do you really want to delete your CryptoBit Account?
                          </p>
                          <div className="del-cancel-btn">
                            <div className="cancel">
                              <button
                                onClick={toggleDeleteModelWindow}
                                className="cancel-btn"
                              >
                                Cancel
                              </button>
                            </div>
                            <div className="del">
                              <button
                                onClick={processAccountDeletion}
                                className="del-btn"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          {CryptoBalanceViewer ? (
            <>
              <div onClick={cryptoBalanceToggler} className="overlay"></div>
              <div className="crypto-balance-container">
                <div className="crypto-balance">
                  <div className="crypto-balance-heading">
                    <h1>List of Coins you purchased. Happy Trading!</h1>
                  </div>
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-lg-12">
                        {
                          viewCryptoBalance && Array.isArray(viewCryptoBalance) ?
                          viewCryptoBalance.map((item)=>{
                            return(
                              <div className="bought-crypto-box">
                          <div className="icon">
                            <img src={item.imgUrl} width='20px' alt="" />
                          </div>
                          <div className="description">
                            <div className="key-value">
                              <p className="key">{item.cryptoName}</p>
                              <p className="value">
                                ${item.crypto}
                              </p>
                            </div>
                            <div className="button-container">
                              <button>
                                <Link to="https://zwaply.com/" target="_blank">Trade</Link>
                              </button>
                            </div>
                          </div>
                        </div>
                            )
                          })
                          :
                          viewCryptoBalance ?
                          <div className="no-cryptoBalance-message">
                            <p className="message">
                            {
                              viewCryptoBalance && viewCryptoBalance.message
                            }
                            </p>
                            <div className="buy-btn">
                              <button><Link to='/buycrypto'>Buy now</Link></button>
                            </div>
                          </div>
                          :
                          <Loader loading_text = {'Loading...'} />
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            "loading"
          )}
        </div>
      )}
    </>
  );
};

export default Profile;

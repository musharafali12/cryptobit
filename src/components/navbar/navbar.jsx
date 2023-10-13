import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../contextAPI/contextAPI";

let Navbar = () => {
  let { name, email, proImgUrl } = useContext(Context);
  let [nameLetter, setNameLetter] = useState();
  let [dropdownEmail, setDropDownEmail] = useState();
  let storedUserString = localStorage.getItem("user");
  let storedUser = JSON.parse(storedUserString);
  let auth = storedUser;
  let navigate = useNavigate();
  useEffect(() => {
    if (name) {
      console.log(name);
      name = name.split(" ");
      let letterArray = name.map((item) => {
        return item.charAt(0);
      });
      setNameLetter(letterArray.join(""));
      setDropDownEmail(email);
    }
  }, [name]);
 
 
  // useEffect(()=>{
  //   if(name){
  //     name = name.split(" ");
  //     let letterArray =  name.map((item)=>{
  //       return item.charAt(0)
  //     });
  //     setNameLetter(letterArray.join(""));

  //   }else{
  //     console.log("loading")
  //   }
  // },[]);
  //handle logout
  let handleLogOut = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      <div className="nav-container">
        <nav class="navbar navbar-expand-lg">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">
              CryptoBit
            </a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span
                style={{ color: "white" }}
                class="navbar-toggler-icon"
              ></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <Link
                    to="/"
                    class="nav-link active"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to="/buycrypto" class="nav-link active" aria-current="page">
                    Buy Crypto
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    to="/pricing"
                    class="nav-link active"
                    aria-current="page"
                  >
                    Pricing
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    class="nav-link uni-dropdown active"
                    aria-current="page"
                  >
                    University
                  </Link>
                  <div className="learn-dropdown-container">
                    <div className="learn-dropdown">
                      <ul>
                        <li>Learn NFTs</li>
                        <li>Research & Analysis</li>
                        <li>Learn Crypto Trading</li>
                        <li>Crypto Mining</li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li class="nav-item">
                  {auth ? (
                    ""
                  ) : (
                    <Link
                      to="login"
                      class="nav-link active"
                      aria-current="page"
                    >
                      Login
                    </Link>
                  )}
                </li>
                <li class="nav-item">
                  {auth ? (
                    ""
                  ) : (
                    <Link
                      to="/register"
                      class="nav-link active"
                      aria-current="page"
                    >
                      Register
                    </Link>
                  )}
                </li>
                <li class="nav-item">
                  {auth ? (
                    <>
                    <Link
                      class="nav-link active"
                      aria-current="page"
                    >
                      News
                    </Link>
                    <div className="learn-dropdown-container">
                    <div className="learn-dropdown">
                      <ul>
                        <li>What's New</li>
                        <li>Market Trends</li>
                        <li>Company News</li>
                        <li>Events</li>
                      </ul>
                    </div>
                  </div>
                    </>
                  ) : (
                    ""
                  )}
                </li>
              </ul>
              {
                auth ?
                <div className="dropdown-container">
                <div className="dropdown-toggler">
                  <img src={proImgUrl} width='35px' alt="" />
                </div>
                <div className="dropdown">
                  <ul>
                    <li className="profile-info">
                      <Link to="/profile">
                      {
                        nameLetter ? <span className="name-letters">{nameLetter}</span> : 'loading'
                      }
                      {
                        name && dropdownEmail ? <div><p>{name}</p><p>{dropdownEmail}</p></div>:'loading'
                      }
                      </Link>
                    </li>
                    <li>
                      <Link to='/dashboard'>
                      <i class="fa-solid fa-table-columns"></i>{" "}
                      <span style={{ marginLeft: "15px" }}>Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <Link to='/buycrypto'>
                      <i class="fa-solid fa-cart-shopping"></i>{" "}
                      <span style={{ marginLeft: "10px" }}>
                        Buy Crypto
                      </span>
                      </Link>
                    </li>
                    <li>
                      <Link to='/watchlistpage'>
                      <i class="fa-thin fa-list"></i>
                      <span style={{ marginLeft: "14px" }}>
                      Your Watchlist
                      </span>
                        
                        </Link>
                    </li>
                    <li>
                     <Link to='/' onClick={handleLogOut}>
                     <i class="fa-solid fa-right-from-bracket"></i>{" "}
                      <span style={{ marginLeft: "12px" }}>Logout</span>
                     </Link>
                    </li>
                  </ul>
                </div>
              </div>
              :
              ''
              }
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;

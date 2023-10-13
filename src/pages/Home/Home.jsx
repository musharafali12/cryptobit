import { Link, json, useNavigate } from "react-router-dom";
import Hero from "../../components/hero-section/hero";
import { useContext, useEffect } from "react";
import { Context } from "../../contextAPI/contextAPI";
import "./Home.css";
import Sec1Img from "./sec1-leftside-removebg-preview.png";
import Register from "./register.webp";
import Coins from './coins.webp'
import Trading from './trading.webp';
import MarketDataImg from './market-data-removebg.png';
import { useInView } from "react-intersection-observer";

let Home = () => {
  let refSec1H2 = useInView({ threshold: 0.2 });
  let refSec1H1 = useInView({ threshold: 0.2 });
  let refSec1P = useInView({ threshold: 0.2 });
  let refSec1Btn = useInView({ threshold: 0.2 });
  let refSec2Step1 = useInView({ threshold: 0.2 });
  let refSec2Step2 = useInView({ threshold: 0.2 });
  let refSec2Step3 = useInView({ threshold: 0.2 });
  let refSec3H2 = useInView({ threshold: 0.2 });
  let refSec3H1 = useInView({ threshold: 0.2 });
  let refSec3P = useInView({ threshold: 0.2 });
  let refSec3Btn = useInView({ threshold: 0.2 });


  let {name, setName, setEmail, loadProImg, setLoadProImg, setProImgUrl} = useContext(Context);
  let storedUserString = localStorage.getItem('user');
  let storedUser = JSON.parse(storedUserString);
  let navigate = useNavigate();

  useEffect(()=>{
     if(storedUser){
      navigate('/dashboard')
     }
  },[]);

  return (
    <>
      <Hero />
      <section className="section1">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="sec1-left-side">
                <img src={Sec1Img} alt="" />
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="sec1-right-side">
                <h2 className={refSec1H2.inView ? "fade-in-h2":""} ref={refSec1H2.ref}>
                  Invest to Earn
                </h2>
                <h1 className={refSec1H1.inView ? "fade-in-h1":""} ref={refSec1H1.ref}>
                  Trade on CryptoBit
                </h1>
                <p className={refSec1P.inView ? "fade-in-p":""} ref={refSec1P.ref}>
                  Invest in top 20 popular cryptocurrencies with CryptoBit and
                  let your assets work for you
                </p>
                <button className={refSec1Btn.inView ? "fade-in-btn":""} ref={refSec1Btn.ref}>
                  <Link to="/register">Start Now</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section2">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="sec2-heading">
                <h1>Start Trading in 3 simple steps</h1>
                <p>Start Trading with confidence in 3 simple steps,i.e. Register, buy coins and start trading</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div ref = {refSec2Step1.ref} className={refSec2Step1.inView ? 'step1 fade-in':'step1'}>
                <div className="img-container">
                  <img src={Register} alt="" />
                </div>
                <div className="step-title">
                    <p>1. Register an account</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
            <div ref = {refSec2Step2.ref} className={refSec2Step2.inView ? 'step2 fade-in':'step2'}>
                <div className="img-container">
                  <img src={Coins} alt="" />
                </div>
                <div className="step-title">
                    <p>2. Buy Coins</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
            <div ref = {refSec2Step3.ref} className={refSec2Step3.inView ? 'step3 fade-in':'step3'}>
                <div className="img-container">
                  <img src={Trading} alt="" />
                </div>
                <div className="step-title">
                    <p>3. Start Trading</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section3">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="sec1-right-side">
                <h2 className={refSec3H2.inView ? "fade-in-h2":""} ref={refSec3H2.ref}>
                  Market Data
                </h2>
                <h1 className={refSec3H1.inView ? "fade-in-h1":""} ref={refSec3H1.ref}>
                  Real Time Market Data
                </h1>
                <p className={refSec3P.inView ? "fade-in-p":""} ref={refSec3P.ref}>
                  Observe market data such as prices, market cap, 24H percentage price change etc. in real time to make informed decisions
                </p>
                <button className={refSec3Btn.inView ? "fade-in-btn":""} ref={refSec3Btn.ref}>
                  <Link to="/pricing">View Market</Link>
                </button>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="sec1-left-side">
                <img src={MarketDataImg} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

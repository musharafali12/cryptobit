import { useEffect } from "react";
import "./hero.css";

let Hero = () => {

  useEffect(()=>{
    let hero_section = document.getElementById('h-section');
    if(hero_section){
        setInterval(() => {
          hero_section.classList.add('fade-in');
        }, 1000);
    }
  },[]);

  return (
    <>
      <div className="hero-container">
        <div className="col-lg-12">
          <div className="overlay"></div>
          <div id="h-section" className='hero-section'>
            <div className="content">
              <p>
                CryptoBit is world's leading platform for cryptocurrency
                trading.
              </p>
              <button>Get Started</button>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Hero;

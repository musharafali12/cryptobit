import { useContext, useEffect, useRef, useState } from "react";
import "./buy.css";
import { Context } from "../../contextAPI/contextAPI";
import { useNavigate } from "react-router-dom";
let imgUrls = require("./imgUrls");

let Buy = () => {
  let { name, setName, setEmail, setCryptoAmount, setProImgUrl } =
    useContext(Context);
  let storedUserString = localStorage.getItem("user");
  let storedUser = JSON.parse(storedUserString);
  let auth = storedUser;
  let navigate = useNavigate();
  useEffect(() => {
    if (!storedUserString) {
      navigate("/login");
      return;
    } else {
      setName(auth.user.name);
      setEmail(auth.user.email);
    }
  }, []);

  let fetchProImg = async () => {
    let response = await fetch(
      `http://localhost:1000/fetchProImg/${storedUser.user._id}`
    );
    response = await response.json();
    setProImgUrl(
      `http://localhost:1000/images/${response.imageUrl.generatedImgName}`
    );
  };

  useEffect(() => {
    if(storedUserString){
      fetchProImg();
    }
  }, []);

  //state to open/colse selection dropdown
  let [openDropdown, setOpenDropdown] = useState(false);
  let [showHideLi, setShowHideLi] = useState({});
  let [showFirstSelection, setShowFirstSelection] = useState(true);

  //set Crypto Symbol
  let [cryptoSymbol, setCryptoSymbol] = useState("");
  let [cryptoTextContent, setCryptoTextContent] = useState("");
  let [cryptoRate, setCryptoRate] = useState({});
  let [imgUrl, setImgUrl] = useState("");
  let [step2, setStep2] = useState(false);

  //set Crypto and USD amount in inpur fields
  let [usd, setUSD] = useState("");
  let [crypto, setCrypto] = useState("");

  //Fetch crypto exchange rates
  let fetchCryptoRates;
  try {
    fetchCryptoRates = async () => {
      let response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoSymbol}&vs_currencies=usd`
      );
      if (!response) {
        alert("failed to fetch data");
      }
      let data = await response.json();
      setCryptoRate(data);
      console.log(data);
    };
  } catch (error) {
    alert(error);
  }

  useEffect(() => {
    fetchCryptoRates();
  }, [cryptoSymbol]);

  //handle dropdown opening/closing
  let handleDropDown = (event) => {
    setOpenDropdown(!openDropdown);
  };

  //Get symbol text
  let names = {
    "Select Currency": false,
    Bitcoin: false,
    Ethereum: false,
    Tether: false,
    BNB: false,
    XRP: false,
    "USD Coin": false,
    "Lido Stacked Ether": false,
    Cardano: false,
    Dogecoin: false,
    Solana: false,
    TRON: false,
    Polkadot: false,
    Polygon: false,
    Toncoin: false,
    Litecoin: false,
    ShibaInu: false,
    "Wrapped Bitcoin": false,
    Dai: false,
    "Bitcoin Cash": false,
    Avalanche: false,
  };

  let getSymbolText = (event) => {
    let symbolText = event.target.textContent;
    setCryptoTextContent(symbolText);
    let symbols = {
      Bitcoin: "bitcoin",
      Ethereum: "ethereum",
      Tether: "tether",
      BNB: "binancecoin",
      XRP: "ripple",
      "USD Coin": "usd-coin",
      "Lido Stacked Ether": "staked-ether",
      Cardano: "cardano",
      Dogecoin: "dogecoin",
      Solana: "solana",
      TRON: "tron",
      Polkadot: "polkadot",
      Polygon: "matic-network",
      Toncoin: "the-open-network",
      Litecoin: "litecoin",
      ShibaInu: "shiba-inu",
      "Wrapped Bitcoin": "wrapped-bitcoin",
      Dai: "dai",
      "Bitcoin Cash": "bitcoin-cash",
      Avalanche: "avalanche-2",
    };

    setCryptoSymbol(symbols[symbolText]);
    names[symbolText] = true;
    setShowHideLi(names);
    setShowFirstSelection(false);
    setStep2(true);
    //handle image urls
    setImgUrl(imgUrls[symbolText]);
  };

  //handle First selection

  let handleFirstSelection = (event) => {
    let textContent = event.target.textContent;
    names[textContent] = true;
    setShowHideLi(names);
    setShowFirstSelection(true);
    setStep2(false);
  };

  let handleUsdChange = (event) => {
    if (cryptoRate) {
      setCrypto(event.target.value / cryptoRate[cryptoSymbol].usd);
      setUSD(event.target.value);
    }
  };

  let handleCryptoChange = (event) => {
    if (cryptoRate) {
      setUSD(event.target.value * cryptoRate[cryptoSymbol].usd);
      setCrypto(event.target.value);
    }
  };

  //Proceed Order
  let proceedOrder = () => {
    setCryptoAmount({
      crypto: crypto,
      usd: usd,
      usdSymbol: "USD",
      cryptoSymbol: cryptoSymbol,
      cryptoTextContent: cryptoTextContent,
      imgUrl: imgUrl,
    });
    navigate("/cryptoInvoice");
  };

  return (
    <>
      <div className="page-heading">
        <p className="title">Buy Crypto Now</p>
        <h1>Buy Top 20 Cryptocurrencies with 0 fee</h1>
        <p>
          At CryptoBit, you are provided with a place to purchase the top 20
          Cryptocurrencies of the world in true price and start trading right
          now!
        </p>
      </div>
      <div className="converter-container">
        <h1>Step 1: Select the coin you want to buy</h1>
        <div
          className={
            openDropdown
              ? "currency-dropdown-container open-dropdown"
              : "currency-dropdown-container"
          }
        >
          <div onClick={handleDropDown} className="dropdown">
            <ul>
              <li
                onClick={handleFirstSelection}
                className={
                  openDropdown ||
                  showHideLi["Select Currency"] ||
                  showFirstSelection
                    ? "show-li"
                    : "hide-li "
                }
                value="selectCurrency"
              >
                <div className="selection-title">
                  <p>Select Currency</p>
                  <i class="fa-solid fa-caret-down"></i>
                </div>
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Bitcoin"] ? "show-li" : "hide-li"
                }
                value="Bitcoin"
              >
                <img src={imgUrls.Bitcoin} width="20px" alt="" />
                Bitcoin
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Ethereum"] ? "show-li" : "hide-li"
                }
                value="ethereum"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880"
                  width="20px"
                  alt=""
                />
                Ethereum
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Tether"] ? "show-li" : "hide-li"
                }
                value="tether"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663"
                  width="20px"
                  alt=""
                />
                Tether
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["BNB"] ? "show-li" : "hide-li"
                }
                value="bnb"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850"
                  width="20px"
                  alt=""
                />
                BNB
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["XRP"] ? "show-li" : "hide-li"
                }
                value="xrp"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1605778731"
                  width="20px"
                  alt=""
                />
                XRP
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["USD Coin"] ? "show-li" : "hide-li"
                }
                value="xrp"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389"
                  width="20px"
                  alt=""
                />
                USD Coin
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Lido Stacked Ether"]
                    ? "show-li"
                    : "hide-li"
                }
                value="staked-ether"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/13442/large/steth_logo.png?1608607546"
                  width="20px"
                  alt=""
                />
                Lido Stacked Ether
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Cardano"] ? "show-li" : "hide-li"
                }
              >
                <img
                  src="https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860"
                  width="20px"
                  alt=""
                />
                Cardano
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Dogecoin"] ? "show-li" : "hide-li"
                }
                value="dogecoin"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256"
                  width="20px"
                  alt=""
                />
                Dogecoin
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Solana"] ? "show-li" : "hide-li"
                }
                value="solana"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422"
                  width="20px"
                  alt=""
                />
                Solana
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["TRON"] ? "show-li" : "hide-li"
                }
                value="tron"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/1094/large/tron-logo.png?1547035066"
                  width="20px"
                  alt=""
                />
                TRON
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Polkadot"] ? "show-li" : "hide-li"
                }
                value="polkadot"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/12171/large/polkadot.png?1639712644"
                  width="20px"
                  alt=""
                />
                Polkadot
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Polygon"] ? "show-li" : "hide-li"
                }
                value="polygon"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912"
                  width="20px"
                  alt=""
                />
                Polygon
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Toncoin"] ? "show-li" : "hide-li"
                }
                value="toncoin"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png?1670498136"
                  width="20px"
                  alt=""
                />
                Toncoin
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Litecoin"] ? "show-li" : "hide-li"
                }
                value="litecoin"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/2/large/litecoin.png?1547033580"
                  width="20px"
                  alt=""
                />
                Litecoin
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["ShibaInu"] ? "show-li" : "hide-li"
                }
                value="shibaInu"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/11939/large/shiba.png?1622619446"
                  width="20px"
                  alt=""
                />
                ShibaInu
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Wrapped Bitcoin"]
                    ? "show-li"
                    : "hide-li"
                }
                value="wrapped-bitcoin"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1548822744"
                  width="20px"
                  alt=""
                />
                Wrapped Bitcoin
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Dai"] ? "show-li" : "hide-li"
                }
                value="dai"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png?1687143508"
                  width="20px"
                  alt=""
                />
                Dai
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Bitcoin Cash"]
                    ? "show-li"
                    : "hide-li"
                }
                value="bitcoin-cash"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png?1594689492"
                  width="20px"
                  alt=""
                />
                Bitcoin Cash
              </li>
              <li
                onClick={getSymbolText}
                className={
                  openDropdown || showHideLi["Avalanche"]
                    ? "show-li"
                    : "hide-li"
                }
                value="avalanche"
              >
                <img
                  src="https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png?1670992574"
                  width="20px"
                  alt=""
                />
                Avalanche
              </li>
            </ul>
          </div>
        </div>
        {step2 ? (
          <div className="purchase-panel-container">
            <h1>Step 2: Enter the amount in USD</h1>
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-6">
                  <label htmlFor="">Amount (USD)</label>
                  <div className="usd-container">
                    <input
                      onChange={handleUsdChange}
                      value={usd ? usd : crypto}
                      type="number"
                    />
                    <i class="fa-solid fa-dollar-sign"></i>
                  </div>
                </div>
                <div className="col-lg-6">
                  <label htmlFor="">Amount ( {cryptoSymbol} ):</label>
                  <div className="crypto-container">
                    <input
                      onChange={handleCryptoChange}
                      value={crypto ? crypto : usd}
                      type="number"
                    />
                    <img src={imgUrl} width="20px" alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="buy-btn">
              <button onClick={proceedOrder}>Buy Now</button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Buy;

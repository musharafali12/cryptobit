import { useEffect, useState } from "react";
import LineChart from "../../components/LineChart";
import "./price_change.css";
import { useContext } from "react";
import { Context } from "../../contextAPI/contextAPI";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/loader";
let imgUrls = require("./imgUrls");

let BtcPriceChange = () => {
  let loading_text = 'Loading';
  //context API
  let { sendCryptoId, setCryptoAmount, setProImgUrl } = useContext(Context);

  let cryptoId = sendCryptoId;
  //Navigation Hook
  let navigate = useNavigate();

  //set crypto rates
  let [cryptoSymbol, setCryptoSymbol] = useState("");
  let [cryptoRate, setCryptoRate] = useState({});

  //set Crypto and USD amount in input fields
  let [usd, setUSD] = useState("");
  let [crypto, setCrypto] = useState("");

  //set crypto symbols urls
  let [imgUrl, setImgUrl] = useState("");

  //state for crypto details
  let [cryptoDetail, setCryptoDetail] = useState();
  let [allCoinsData, setAllCoinsData] = useState();

  //state for trending coins
  let [trendingCoins, setTrendingCoins] = useState();



  let storedUserString = localStorage.getItem("user");
  let storedUser = JSON.parse(storedUserString);

  let fetchProImg =async ()=>{
    let response = await fetch(`http://localhost:1000/fetchProImg/${storedUser.user._id}`);
    response =  await response.json();
    setProImgUrl(`http://localhost:1000/images/${response.imageUrl.generatedImgName}`);
  }

  useEffect(()=>{
    
    fetchProImg();
    
  },[]);


  //Fetch crypto exchange rates

  let fetchCryptoRates;
  let response;
  let crypto_details;
  try {
    fetchCryptoRates = async () => {
      if(sendCryptoId){
        response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${sendCryptoId}&vs_currencies=usd`
        );
  
        const url = `https://api.coingecko.com/api/v3/coins/${sendCryptoId}`;
  
        crypto_details = await fetch(`${url}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }else{

      }

      //API for fetching trending coins
      let fetchTrendingCoins = await fetch(
        "https://api.coingecko.com/api/v3/search/trending",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //API for fetching all 20 coins data
      let allCoins20Data = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&locale=en");

      if (!response) {
        alert("failed to fetch data");
      }else{
        let data = await response.json();
      console.log(response);
      setCryptoRate(data);
      }
      

      let data2 = await crypto_details.json();
      console.log(data2);
      setCryptoDetail(data2);

      let data3 = await fetchTrendingCoins.json();
      setTrendingCoins(data3);

      allCoins20Data = await allCoins20Data.json();
      setAllCoinsData(allCoins20Data);

    };
  } catch (error) {
    alert(error);
  }
  

  //Fetch Crypto data
  let symbols = {
    bitcoin:'Bitcoin' ,
    ethereum:'Ethereum' ,
    tether:'Tether',
    binancecoin: "BNB",
    ripple: "XRP",
    "usd-coin": "USD Coin",
    "staked-ether": "Lido Stacked Ether",
    cardano: "Cardano",
    dogecoin: "Dogecoin",
    solana: "Solana",
    tron: "TRON",
    polkadot: "Polkadot",
    'matic-network': "Polygon",
    "the-open-network": "Toncoin",
    litecoin: "Litecoin",
    'shiba-inu': "ShibaInu",
    "wrapped-bitcoin": "Wrapped Bitcoin",
    dai: "Dai",
    "bitcoin-cash": "Bitcoin Cash",
    "avalanche-2": "Avalanche",
  };

  let cryptoName;
  useEffect(() => {
    if(sendCryptoId){
      cryptoName = symbols[cryptoId];
      setImgUrl({id:imgUrls[cryptoName], cryptoName:cryptoName});
      
    }
    fetchCryptoRates();
  }, [cryptoId]);

  //format numbers into units
  function formatNumberWithUnits(number) {
    const units = ["K", "M", "B", "T"];
    const unit =
      units[Math.floor((number / 1.0e3).toFixed(0).toString().length / 3) - 1];

    return (
      (number / Math.pow(1.0e3, units.indexOf(unit) + 1)).toFixed(2) + unit
    );
  }

  let handleUsdChange = (event) => {
    if (cryptoRate) {
      setCrypto(event.target.value / cryptoRate[cryptoId].usd);
      setUSD(event.target.value);
    }
  };

  let handleCryptoChange = (event) => {
    if (cryptoRate) {
      setUSD(event.target.value * cryptoRate[cryptoId].usd);
      setCrypto(event.target.value);
    }
  };

  //Proceed Order
  let proceedOrder = () => {
    

    let storedUserString = localStorage.getItem('user');
    if(storedUserString){
      setCryptoAmount({
        crypto: crypto,
        usd: usd,
        usdSymbol: "USD",
        cryptoSymbol: cryptoSymbol,
        cryptoTextContent:imgUrl.cryptoName,
        imgUrl:imgUrl.id,
      });

      navigate("/cryptoInvoice");
    } else{
      alert('Please login to your account or register');
      navigate('/login');
    }
    
  };
console.log(`crypto id from btc price change:${cryptoId}`)
  return (
    <>
      {
        cryptoRate && cryptoDetail && trendingCoins ?
        <>
        <div className="price-change-container">
        <h1 className="price-change-heading">
          {imgUrl ? imgUrl.cryptoName:'Currency name'} historical Price Change Statistics
        </h1>
        <p className="data-provider">
          <span>Data Source: </span>Data Provided by CoinGecko
        </p>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              <div className="chart-container">
                <div className="crypto-details">
                  <div className="img-price-container">
                    <div className="img-price">
                      <img src={cryptoId ? imgUrl.id:''} width="40px" alt="" />
                      <p>
                        $
                        {cryptoRate[cryptoId] && sendCryptoId
                          ? cryptoRate[cryptoId].usd
                          : "loading"}
                      </p>
                    </div>
                    <div className="trade-btn">
                      <button><a href="https://zwaply.com/" target="_blank">Trade</a></button>
                    </div>
                  </div>
                  <div className="percentage-change">
                    <p
                      style={
                        cryptoDetail && {
                          color:
                            cryptoDetail.market_data
                              .price_change_percentage_24h < 0
                              ? "red"
                              : "green",
                        }
                      }
                    >
                      <span>Price Change: </span>
                      {cryptoDetail
                        ? cryptoDetail.market_data.price_change_percentage_24h
                        : "loading"}
                      % (24H)
                    </p>
                  </div>
                </div>
                <LineChart cryptoId={cryptoId} />
                <div className="detail-fields-container">
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-6">
                      <div className="detail-fields">
                        <p className="key">
                          Market Cap (USD){" "}
                          <i class="fa-regular fa-circle-info"></i>
                        </p>
                        <p className="value">
                          {cryptoDetail
                            ? formatNumberWithUnits(
                                cryptoDetail.market_data.market_cap.usd
                              )
                            : "loading"}
                        </p>
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-3 col-sm-6">
                      <div className="detail-fields">
                        <p className="key">
                          Circulating Supply{" "}
                          <i class="fa-regular fa-circle-info"></i>
                        </p>
                        <p className="value">
                          {cryptoDetail
                            ? formatNumberWithUnits(
                                cryptoDetail.market_data.circulating_supply
                              )
                            : "loading"}
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-6">
                      <div className="detail-fields">
                        <p className="key">
                          Max Supply <i class="fa-regular fa-circle-info"></i>
                        </p>
                        <p className="value">
                          {cryptoDetail
                            ? formatNumberWithUnits(
                                cryptoDetail.market_data.max_supply
                              )
                            : "loading"}
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-6">
                      <div className="detail-fields">
                        <p className="key">
                          Total Supply <i class="fa-regular fa-circle-info"></i>
                        </p>
                        <p className="value">
                          {cryptoDetail
                            ? formatNumberWithUnits(
                                cryptoDetail.market_data.total_supply
                              )
                            : "loading"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="purchase-panel-container">
                <h1>Purchase {imgUrl.cryptoName} Now</h1>
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
                      <label htmlFor="">Amount ( {imgUrl.cryptoName} ):</label>
                      <div className="crypto-container">
                        <input
                          onChange={handleCryptoChange}
                          value={crypto ? crypto : usd}
                          type="number"
                        />
                        <img src={cryptoId ? imgUrl.id:''} width="20px" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="buy-btn">
                  <button onClick={proceedOrder}>Buy Now</button>
                </div>
              </div>
              <div className="trending-coins-container">
                <h1>
                  Trending Coins <i class="fa-regular fa-circle-info"></i>
                </h1>
                <table>
                  <thead>
                    <th>Name</th>
                    <th>Market Cap Rank</th>
                  </thead>
                  <tbody>
                    {trendingCoins
                      ? trendingCoins.coins.map((item) => {
                          return (
                            <tr>
                              <td>
                                <img
                                  src={item.item.small}
                                  width="20px"
                                  alt=""
                                />
                                {item.item.name}
                              </td>
                              <td>
                                {
                                  item.item.market_cap_rank
                                }
                              </td>
                            </tr>
                          );
                        })
                      : ""}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
        :
        <Loader loading_text = {loading_text} />
      }

    </>
  );
};

export default BtcPriceChange;

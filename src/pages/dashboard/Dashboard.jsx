import { useContext, useEffect, useState } from "react";
import "./Dashboard.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.min.css";
import "owl.carousel/dist/assets/owl.theme.default.min.css";
import img1 from "../Home/coins.jpg";
import img2 from "../Home/register.jpg";
import img3 from "../Home/market-data.jpg";
import { Context } from "../../contextAPI/contextAPI";
import { useNavigate } from "react-router-dom";
import LineChart from "../../components/LineChart";
import imgUrls from "./imgUrls";
import Loader from "../Loader/loader";

let Dashboard = () => {
  let loading_text = "Loading...";

  let { sendCryptoId2, setSendCryptoId2, setName, setEmail, setProImgUrl } =
    useContext(Context);


    let fetchProImg =async ()=>{
      let response = await fetch(`http://localhost:1000/fetchProImg/${storedUser.user._id}`);
      response =  await response.json();
      setProImgUrl(`http://localhost:1000/images/${response.imageUrl.generatedImgName}`);
    }
  
    useEffect(()=>{
      
      fetchProImg();
      
    },[]);


  let [watchlistItem, setWatchListItem] = useState();

  let storedUserString = localStorage.getItem("user");
  let storedUser = JSON.parse(storedUserString);
  //Navigation Hook
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

  let fetchWatchList = async () => {
    try {
      let response = await fetch(
        `http://localhost:1000/getwatchlistdata?userId=${storedUser.user._id}`,
        {
          method: "GET",
          "Content-Type": "application/json",
        }
      );
      if (response) {
        response = await response.json();
        setWatchListItem(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWatchList();
  }, []);

  //carousel options

  const options = {
    items: 4,
    loop: true,
    margin: 15,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 1000,
    nav: false,
    dots: false,
    responsive: {
      0: {
        items: 1, // Number of items to display on small screens
      },
      768: {
        items: 2, // Number of items to display on medium screens
      },
      992: {
        items: 4, // Number of items to display on large screens
      },
    },
  };

  //pass cryptoId
  let passCryptoId = (id) => {
    setSendCryptoId2(id);
    console.log(id);
  };

  let cryptoId = sendCryptoId2;

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

  //state for trending coins
  let [trendingCoins, setTrendingCoins] = useState();

  //Fetch crypto exchange rates

  let fetchCryptoRates;
  let response;
  let crypto_details;
  try {
    fetchCryptoRates = async () => {
      if (sendCryptoId2) {
        response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${sendCryptoId2}&vs_currencies=usd`
        );

        const url = `https://api.coingecko.com/api/v3/coins/${sendCryptoId2}`;

        crypto_details = await fetch(`${url}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
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
    };
  } catch (error) {
    alert(error);
  }

  let symbols = {
    bitcoin: "Bitcoin",
    ethereum: "Ethereum",
    tether: "Tether",
    binancecoin: "BNB",
    ripple: "XRP",
    "usd-coin": "USD Coin",
    "staked-ether": "Lido Stacked Ether",
    cardano: "Cardano",
    dogecoin: "Dogecoin",
    solana: "Solana",
    tron: "TRON",
    polkadot: "Polkadot",
    "matic-network": "Polygon",
    "the-open-network": "Toncoin",
    litecoin: "Litecoin",
    "shiba-inu": "ShibaInu",
    "wrapped-bitcoin": "Wrapped Bitcoin",
    dai: "Dai",
    "bitcoin-cash": "Bitcoin Cash",
    "avalanche-2": "Avalanche",
  };

  useEffect(() => {
    if (sendCryptoId2) {
      let cryptoName = symbols[cryptoId];
      setImgUrl({ id: imgUrls[cryptoName], cryptoName: cryptoName });
    }
     fetchCryptoRates();
  }, [sendCryptoId2]);
  //format numbers into units
  function formatNumberWithUnits(number) {
    const units = ["K", "M", "B", "T"];
    const unit =
      units[Math.floor((number / 1.0e3).toFixed(0).toString().length / 3) - 1];

    return (
      (number / Math.pow(1.0e3, units.indexOf(unit) + 1)).toFixed(2) + unit
    );
  }

  return (
    <>
      <h1 className="dashboard-heading">My Dashboard</h1>
      {!watchlistItem ? (
        <Loader loading_text={loading_text} />
      ) : (
        <div className="owl-container">
          <OwlCarousel className="owl-theme" {...options}>
            {!watchlistItem
              ? ""
              : watchlistItem.map((item) => {
                  return (
                    <div onClick={() => passCryptoId(item.id)} class="item">
                      <div className="item-container">
                        <div className="img-container">
                          <img src={item.image} alt="" />
                        </div>
                        <h1>${item.current_price}</h1>
                        <p style={{color: item.price_change_percentage_24h < 0 ? 'red':'green'}}>
                          <span>24H Price change</span>:{item.price_change_percentage_24h}
                        </p>
                      </div>
                    </div>
                  );
                })}
          </OwlCarousel>
        </div>
      )}
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-8">
            <div className="chart-container">
              <div className="crypto-details">
                <div className="img-price-container">
                  <div className="img-price">
                    <img src={cryptoId ? imgUrl.id : ""} width="40px" alt="" />
                    <p>
                      $
                      {cryptoRate[cryptoId] && sendCryptoId2
                        ? cryptoRate[cryptoId].usd
                        : "loading"}
                    </p>
                  </div>
                  <div className="trade-btn">
                    <button>
                      <a href="https://zwaply.com/" target="_blank">
                        Trade
                      </a>
                    </button>
                  </div>
                </div>
                <div className="percentage-change">
                  <p
                    style={
                      cryptoDetail && {
                        color:
                          cryptoDetail.market_data.price_change_percentage_24h <
                          0
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
              <LineChart cryptoId = {cryptoId} />
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
                              <img src={item.item.small} width="20px" alt="" />
                              {item.item.name}
                            </td>
                            <td>{item.item.market_cap_rank}</td>
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
    </>
  );
};

export default Dashboard;

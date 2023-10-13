import "./cryptoprices.css";
import { useContext, useEffect, useState } from "react";
import sideImg from "../Prices/side-image.png";
import { Context } from "../../contextAPI/contextAPI";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader/loader";

let CryptoPrice = () => {
  //context API
  let { setSendCryptoId, setProImgUrl, setName, setEmail } = useContext(Context);


  //check if user is logged in
  let storedUserString = localStorage.getItem("user");
  let storedUser = JSON.parse(storedUserString);
  let auth = storedUser;
  let navigate = useNavigate();
  useEffect(() => {
    if (!auth) {
      navigate("/login");
    } else {
      setName(auth.user.name);
      setEmail(auth.user.email);
    }
  }, []);

  //set loading and coin states
  let [loading, setLoading] = useState(true);
  let [coins, setCoins] = useState([]);
  let loading_text = 'Loading';

  //states for sorting the table data
  let [sortColumn, setSortColumn] = useState("rank");
  let [ascending, setAscending] = useState(true);



  let fetchProImg =async ()=>{
    let response = await fetch(`http://localhost:1000/fetchProImg/${storedUser.user._id}`);
    response =  await response.json();
    setProImgUrl(`http://localhost:1000/images/${response.imageUrl.generatedImgName}`);
  }

  useEffect(()=>{
    
    fetchProImg();
    
  },[]);

  //Fetching crypto news data
  // let apiKey = '6660a749-91ed-4c3d-b376-5486a8c7bb32';
  // useEffect(()=>{
  //   let fetchCrtptoNews = async ()=>{
  //     try {
  //       let response = await fetch('https://api-v2.flipsidecrypto.xyz',{
  //       headers : {
  //         method:'POST',
  //         'Content-Type': 'application/json',
  //         'x-api-key': apiKey
  //       }
  //     });

  //     response = await response.json();
  //     } catch (error) {
  //       console.log(`Error: ${error}`)
  //     }

  //   }
  // fetchCrtptoNews();
  // },[]);

  //Fetch crypto data when component will mount
  useEffect(() => {
    let fetchCrypto = async () => {
      try {
        const url =
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&locale=en";

        //Making Api call
        let response = await fetch(`${url}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        //Check if response returns some error
        if (!response.ok) {
          throw new Error("The network response was not ok");
        }

        //Converting or parsing data into js object
        let data = await response.json();
        console.log(data);
        //Updating states
        setLoading(false);
        setCoins(data);
      } catch (error) {
        console.error(`Error fetching data: ${error}`);
        setLoading(false);
        setCoins([]);
      }
    };
    //calling the data fetching function
    fetchCrypto();
  }, []);

  //Sorting logic
  let handleSort = (column) => {
    if (column === sortColumn) {
      setAscending(!ascending);
    } else {
      setSortColumn(column);
      setAscending(true);
    }
  };

  const sortedData = coins.slice().sort((a, b) => {
    const valueA = parseFloat(a[sortColumn]);
    const valueB = parseFloat(b[sortColumn]);

    return ascending ? valueA - valueB : valueB - valueA;
  });

  //format numbers into units
  function formatNumberWithUnits(number) {
    const units = ["K", "M", "B", "T"];
    const unit =
      units[Math.floor((number / 1.0e3).toFixed(0).toString().length / 3) - 1];

    return (
      (number / Math.pow(1.0e3, units.indexOf(unit) + 1)).toFixed(2) + unit
    );
  }

  //Watchlist handler
  let handleWatchList = async (item, id) => {
    let storedUser = JSON.parse(localStorage.getItem("user"));
    let userid = storedUser.user._id;
    item["userId"] = userid;
    item["cryptoId"] = id;
    console.log(item);
    let response = await fetch("http://localhost:1000/watchlist", {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
      },
    });

    response = await response.json();
    console.log(response);
    if (response.message) {
      alert(response.message);
    }
  };

  //Update watchlist on market changes
  let updateWatchList = async () => {
    let response = await fetch("http://localhost:1000/updatewatchlist", {
      method: "PUT",
      body: JSON.stringify(coins),
      headers: {
        "Content-Type": "application/json",
      },
    });

    response = await response.json();
    console.log(response);
  };

  // useEffect(()=>{
  //   setInterval(updateWatchList, 1000);
  // },[]);

  //crypto id sender
  let cryptoIdSender = (cryptoId) => {
    setSendCryptoId(cryptoId);
    console.log(cryptoId);
  };

  return (
    <>
      {coins && coins.length > 0 ? (
        <>
          <h1>Today's Cryptocurrency Prices</h1>
          <table>
            <thead>
              <th></th>
              <th
                onClick={() => {
                  handleSort("rank");
                }}
              >
                #
              </th>
              <th>Name</th>
              <th
                onClick={() => {
                  handleSort("price");
                }}
              >
                Price
              </th>
              <th
                onClick={() => {
                  handleSort("change");
                }}
              >
                24H Change
              </th>
              <th
                className="mc-data-heading"
                onClick={() => {
                  handleSort("mc");
                }}
              >
                Market Cap
              </th>
              <th className="trade-btn-heading">Trade</th>
            </thead>
            <tbody>
              {loading ? (
                <p>Loading Daata</p>
              ) : (
                sortedData.map((coin, index) => {
                  return (
                    <tr
                      onClick={() => {
                        cryptoIdSender(coin.id);
                      }}
                    >
                      <td
                        onClick={() => {
                          handleWatchList(coin, coin.id);
                        }}
                      >
                        <i class="fa-regular fa-star"></i>
                      </td>
                      <td style={{ color: "red" }}>{coin.market_cap_rank}</td>
                      <td className="img-name-container">
                        <div className="img-container">
                          <img src={coin.image} width="20px" alt="" />
                        </div>
                        <div className="name-container">
                          <p>
                            <Link to="/btc-price-change">{coin.name}</Link>
                          </p>
                          <p className="coin-name">{coin.symbol}</p>
                        </div>
                      </td>
                      <td>$ {coin.current_price}</td>
                      <td
                        style={{
                          color:
                            coin.price_change_percentage_24h < 0
                              ? "red"
                              : "green",
                          fontWeight: "bolder",
                        }}
                      >
                        {coin.price_change_percentage_24h}%
                      </td>
                      <td className="mc-data">
                        {formatNumberWithUnits(coin.market_cap)}
                      </td>
                      <td className="trading-btn">
                        <button>
                          <a href="https://zwaply.com/" target="_blank">
                            Trade
                          </a>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </>
      ) : (
        <Loader loading_text = {loading_text} />
      )}
    </>
  );
};

export default CryptoPrice;

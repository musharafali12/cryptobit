import { useContext, useEffect, useState } from "react";
import "./watchlist.css";
import { Context } from "../../contextAPI/contextAPI";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/loader";

let WatchlistPage = () => {
  let { name, setName, setEmail, setProImgUrl } = useContext(Context);
  let [watchlistItem, setWatchListItem] = useState();
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
    fetchProImg();
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
      response = await response.json();
      setWatchListItem(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWatchList();
  }, []);

  //format numbers into units
  function formatNumberWithUnits(number) {
    const units = ["K", "M", "B", "T"];
    const unit =
      units[Math.floor((number / 1.0e3).toFixed(0).toString().length / 3) - 1];

    return (
      (number / Math.pow(1.0e3, units.indexOf(unit) + 1)).toFixed(2) + unit
    );
  }
  console.log(watchlistItem)

  return (
    <>
      {watchlistItem ? (
        <>
          <div className="heading">
            <p className="title">WATCHLIST</p>
            <h1>Welcome to CryptoBit Watchlist</h1>
            <p>
              CryptoBit watchlist allows you to add and monitor the status of
              your favourite cryptocurrencies and take decision based on the
              observed data.
            </p>
          </div>

          <table>
            <thead>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>24H Change</th>
              <th className="mc-data-heading">Market Cap</th>
              <th className="trading-btn-heading">Trade</th>
            </thead>
            <tbody>
              {!watchlistItem || watchlistItem.length == 0 ? (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="watchlist-placeholder">
                    No Item in WatchList
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              ) : (
                watchlistItem.map((coin, index) => {
                  return (
                    <tr>
                      <td style={{ color: "red" }}>{coin.market_cap_rank}</td>
                      <td className="img-name-container">
                        <div className="img-container">
                          <img src={coin.image} width="20px" alt="" />
                        </div>
                        <div className="name-container">
                          <p>{coin.name}</p>
                          <p className="coin-name">{coin.symbol}</p>
                        </div>
                      </td>
                      <td>${coin.current_price}</td>
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
        <Loader loading_text={"Loading..."} />
      )}
    </>
  );
};

export default WatchlistPage;

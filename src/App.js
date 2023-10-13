import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import Home from "./pages/Home/Home";
import About from "./pages/about/about";
import Login from "./pages/Login/Login";
import Register from "./pages/register/register";
import CryptoPrice from "./pages/Prices/cryptoprices";
import { useContext, useEffect } from "react";
import { Context } from "./contextAPI/contextAPI";
import WatchlistPage from "./pages/watchlist/watchlist";
import Buy from "./pages/buysell/buy";
import CryptoInvoice from "./pages/buysell/cryptoInvoice";
import Profile from "./pages/profile/profile";
import ChangePass from "./pages/change password/ChangePass";
import Verification from "./pages/register/verification";
import BtcPriceChange from "./pages/price_change_pages/btc_price_change";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <div className="main-content">
            <Routes>
            <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/" exact element={<Home />} />
              <Route path="/about" exact element={<About />} />
              <Route path="/pricing" exact element={<CryptoPrice />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/register" exact element={<Register />} />

              <Route path="/watchlistpage" exact element={<WatchlistPage />} />

              <Route path="/buycrypto" exact element={<Buy />} />

              <Route path="/cryptoinvoice" exact element={<CryptoInvoice />} />
              <Route path="/profile" exact element={<Profile/>} />
              <Route path="/changepassword" exact element={<ChangePass/>} />
              <Route path="/verify/:token" exact element={<Verification/>} />
              <Route path="/btc-price-change" exact element={<BtcPriceChange/>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

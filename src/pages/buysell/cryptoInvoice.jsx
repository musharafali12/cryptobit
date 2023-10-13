import { useContext, useEffect, useState } from "react";
import "./cryptoInvoice.css";
import TopImg from './top-img.jpg';
import { Context } from "../../contextAPI/contextAPI";
import { useNavigate } from "react-router-dom";


let CryptoInvoice = () =>{

    let {cryptoAmount, setProImgUrl} = useContext(Context);
    let storedUser = JSON.parse(localStorage.getItem('user'));
    let customerName = storedUser.user.name;
    let customerEmail = storedUser.user.email;

    let navigate = useNavigate();

    let [response, setResponse] = useState(false);


    let fetchProImg =async ()=>{
        let response = await fetch(`http://localhost:1000/fetchProImg/${storedUser.user._id}`);
        response =  await response.json();
        setProImgUrl(`http://localhost:1000/images/${response.imageUrl.generatedImgName}`);
      }
    
      useEffect(()=>{
        
        fetchProImg();
        
      },[]);

    let confirmOrder = async () =>{
        let storedUserString = localStorage.getItem('user');
        let storedUser = JSON.parse(storedUserString);
        let userId = storedUser.user._id;

        let response = await fetch('http://localhost:1000/buycrypto',{
            method:"POST",
            body:JSON.stringify({userId:userId, cryptoName:cryptoAmount.cryptoTextContent,crypto:cryptoAmount.usd, imgUrl:cryptoAmount.imgUrl}),
            headers:{
                "Content-Type":"application/json"
            }
        });

        response = await response.json();
        setResponse(true);
        console.log(`crypto purchased:${response}`);
        
    };

    useEffect(()=>{
        if(response){
            setTimeout(() => {
                navigate('/dashboard')
            }, 3000);
        }
    },[response]);



    return(
    <>
    {
        !response ? 
        <>
        <h1 className="invoice-heading">Last Step: Please confirm your order</h1>
    <div className="invoice-container">
        
        <div className="invoice">
            <div className="top-img-container">
                <img src={TopImg} alt="" />
                <img src={TopImg} alt="" />
            </div>
            <div className="invoice-details">
                <div className="company-name">
                    <h1>CryptoBit</h1>
                </div>
                <div className="customer-details">
                    <div className="name">
                        <p>Customer Name:</p>
                        <p>{customerName}</p>
                    </div>
                    <div className="email">
                        <p>Email Address:</p>
                        <p>{customerEmail}</p>
                    </div>
                    <div className="usd-amount">
                        <p>Amount Spent ({cryptoAmount.usdSymbol}):</p>
                        <p>${cryptoAmount.usd}</p>
                    </div>
                    <div className="crypto-amount">
                        <p>Amount Purchased ({cryptoAmount.cryptoSymbol}):</p>
                        <p>{cryptoAmount.crypto}</p>

                    </div>
                </div>
                <table>
                    <th className="t-heading">
                        Order Details
                        
                    </th>
                    <tr>
                        <td style={{fontWeight:'600'}}>Amount Spent ({cryptoAmount.usdSymbol})</td>
                        <td>${cryptoAmount.usd}</td>
                    </tr>
                    <tr>
                        <td style={{fontWeight:'600'}}>Amount Purchased ({cryptoAmount.cryptoSymbol})</td>
                        <td>{cryptoAmount.crypto}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <div className="confirm-btn">
        <button onClick={confirmOrder}>Confirm</button>
    </div>
        </>
        :
        <div className="on-purchase-message">
        <p className="thanks-msg">Thanks for Your Purchase. Your order has been processed</p>
        <p>Your're being redirected towards your account...</p>
        <div className="spinner-container">
            <div className="spinner"></div>
        </div>
    </div>
    }

    </>);
};


export default CryptoInvoice;
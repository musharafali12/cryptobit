import "./LineChart.css";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { userData } from "../pages/watchlist/data";
import { Chart as ChartJS } from "chart.js/auto";
import { useLocation } from 'react-router-dom';

let LineChart = ({cryptoId}) => {

  //crypto id
   

  //state to store price data
  let [hisPriceData, setHisPriceData] = useState([]);

  //Hook for getting current url
  let location = useLocation();
  let current_url = location.pathname;
  //chart legend and x,y values color
  let current_color = current_url === '/dashboard' ? 'white':'black';



  let fetchPriceHistory = async () => {
    let newData = [];

    for (let i = 5; i > 0; i--) {
      let current_date = new Date();
      const previousDay = new Date(current_date);
      previousDay.setDate(current_date.getDate() - i);
      const previousDayString =
        previousDay.getDate().toString().padStart(2, "0") +
        "-" +
        (previousDay.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        previousDay.getFullYear();

      try {
        if(!cryptoId){
          console.log('Please select a coin to view its market change')
          
        }else{
          let response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${cryptoId}/history?date=${previousDayString}&localization=false`
          );

          if (response) {
            response = await response.json();
            newData.push({
              date: previousDayString,
              price: response.market_data.current_price.usd,
            });
          } else{
            console.log('no coin selected')
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    setHisPriceData(newData);
  };

  

  useEffect(()=>{
    fetchPriceHistory();
  },[cryptoId])


  useEffect(() => {
    console.log(
      hisPriceData.map((item) => {
        return item.date;
      })
    );
  }, [hisPriceData]);

  let [Userdata, setUserData] = useState();
  useEffect(() => {
    setUserData({
      labels: hisPriceData.map((item) => {
        return item.date;
      }),
      datasets: [
        {
          label: "Price",
          data: hisPriceData.map((item) => {
            return item.price;
          }),
          backgroundColor: ["aliceblue", "white", "red", "blue", "grey"],
          borderColor: "rgb(119, 170, 214)",
          borderWidth: 1,
          boxShadow: "-1px 15px 47px -1px rgb(119, 170, 214)",
          fill:true
        },
      ],
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks:{
              color:current_color,
            }
          },
          x:{
            ticks:{
              color:current_color,
            }
          }
        },
        plugins:{
          legend:{
            display:true,
            position:'bottom',
            labels:{
              color:current_color,
            }
          }
        }
      }
    },
    );
    
    
  }, [hisPriceData]);
  return <>{Userdata ? <Line data={Userdata} options={Userdata.options} /> : ""}</>;
};

export default LineChart;

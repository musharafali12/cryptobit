import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {userData} from '../pages/watchlist/data';
import {Chart as ChartJS} from 'chart.js/auto';

let BarChart = ()=>{
    let [Userdata, setUserData] = useState(
        {
            labels:userData.map((item)=> item.year),
            datasets:[{
                label:"Users Lost",
                data:userData.map((item)=> item.userLost),
                backgroundColor:['green', 'white','red','blue','grey'],
                borderColor:'purple',
                borderWidth:5,
            }]
        }
    );
    return(
        <>
        <Bar data={Userdata} />
        </>
    );
}


export default BarChart;
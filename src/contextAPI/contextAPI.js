import { createContext, useState } from "react";

export let Context = createContext();

export let ContextProvider = ({children}) => {
    let [auth, setAuth] = useState(false);
    //get user real name
    let [name, setName] = useState();
    let [email, setEmail] = useState();
    let [cryptoAmount, setCryptoAmount] = useState('');

    //send crypto id to price change component/page
    let [sendCryptoId, setSendCryptoId] = useState('bitcoin');
    let [sendCryptoId2, setSendCryptoId2] = useState('bitcoin');

    //profile image url
    let [proImgUrl, setProImgUrl] = useState();
    //load profile img
    let [loadProImg, setLoadProImg] = useState(false);

    return(
        <Context.Provider value={{auth, setAuth, name, setName, email, setEmail, cryptoAmount, setCryptoAmount, sendCryptoId, setSendCryptoId, sendCryptoId2, setSendCryptoId2, proImgUrl, setProImgUrl, loadProImg, setLoadProImg}}>
            {children}
        </Context.Provider>
    );
};
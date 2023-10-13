import './footer.css';

let Footer = () =>{
    return(
        <>
         <footer>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                        <div className="footer-contact-area">
                            <p className="logo">CryptoBit</p>
                            <p className="email"><i class="fa-solid fa-envelope"></i> musharafali274@gmai.com</p>
                            <p className="number"><i class="fa-solid fa-phone"></i> +92107397376</p>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                        <div className="footer-content">
                            <p className="uinversity">University</p>
                            <ul>
                                <li>Research & Analysis</li>
                                <li>Learn NFTs</li>
                                <li>Learn CryptoTrading</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                    <div className="footer-content">
                            <p className="uinversity">Market</p>
                            <ul>
                                <li>Pricing</li>
                                <li>Market Trends</li>
                                <li>News</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <p className="copyright">
                            Copyright &copy; CryptoBit 2023
                        </p>
                    </div>
                </div>
            </div>
         </footer>
        </>
    );
}



export default Footer;
import './loader.css';

let Loader = (props) =>{
    let text = props.loading_text;
    return(
        <>
        <div className="loader-main">
        <div className="loader-container">
        <div className="loader">
            <div className="inner-div">
                {text}...
            </div>
        </div>
        </div>
        </div>
        </>
    );
}

export default Loader;
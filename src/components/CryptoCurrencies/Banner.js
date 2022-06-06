import React from "react";
// import BannerBackground from "../../assets/bannerBackground.jpg";
import "./Banner.css";
import Carousel from "./Carousel.js";

const Banner = () => {
    return (
        <div className="bannerBackground">
            {/* <img src={BannerBackground} alt="" /> */}
            <div className="bannerContent">
                <div className="tagline">
                    <h2>Trending CryptoCurrencies</h2>
                    <h5>View all CryptoCurrencies below</h5>
                </div>
                <Carousel
                    sx={{
                        height: "50%",
                        display: "flex",
                        alignItems: "center",
                    }}
                />
            </div>
        </div>
    );
};

export default Banner;

// import React from "react";
// // import BannerBackground from "../../assets/bannerBackground.jpg";
// import "./Banner.css";
// import Carousel from "./Carousel.js";

// const Banner = () => {
//     return (
//         <div className="bannerBackground">
//             {/* <img src={BannerBackground} alt="" /> */}
//             <div className="bannerContent">
//                 <div className="tagline">
//                     <h2>Trending CryptoCurrencies</h2>
//                     <h5>View all CryptoCurrencies below</h5>
//                 </div>
//                 <Carousel />
//             </div>
//         </div>
//     );
// };

// export default Banner;

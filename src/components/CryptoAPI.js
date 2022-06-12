import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CryptoAPI.css";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { CryptoState } from "../pages/CryptoContext";
import { createTheme, MenuItem, Select, ThemeProvider } from "@mui/material";
import { HighLightCoins } from "../config/api";
import { useNavigate } from "react-router-dom";

const darkTheme = createTheme({
    palette: {
        primary: {
            main: "#fff",
        },

        mode: "dark",
    },
});

const CryptoAPI = () => {
    const [data, setData] = useState(null);
    //use the setCurrency from contextAPI to change
    const { currency, setCurrency } = CryptoState();
    const navigate = useNavigate();

    // const url =
    //     "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false";

    //i think here with currency change need edit the dependecies in use effect
    useEffect(() => {
        axios
            .get(HighLightCoins(currency))
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currency]);

    // use if statement to hide error
    if (!data) return null;

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="cryptoAPI">
                <div className="container">
                    {/* left */}
                    <div className="left">
                        <h2>
                            Check Out Latest Prices Of Cryptocurrencies Here
                        </h2>
                        <div className="with-currency">
                            <button
                                className="btn"
                                onClick={() => navigate("/cryptocurrencies")}
                            >
                                Explore More Coins
                            </button>

                            <Select
                                variant="outlined"
                                style={{
                                    width: 130,
                                    height: 50,
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgb(0, 255, 242)",
                                    },
                                    "& .MuiSvgIcon-root": {
                                        color: "rgb(0, 255, 242)",
                                    },
                                    marginLeft: { xs: "0px", md: "20px" },
                                }}
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            >
                                <MenuItem value={"USD"}>USD</MenuItem>
                                <MenuItem value={"SGD"}>SGD</MenuItem>
                            </Select>
                        </div>
                    </div>

                    {/* right */}
                    <div className="right">
                        <div className="card">
                            <div className="top">
                                <img src={data[0].image} alt="" />
                            </div>

                            <div>
                                <h5>{data[0].name}</h5>
                                <p>${data[0].current_price.toLocaleString()}</p>
                            </div>

                            {data[0].price_change_percentage_24h < 0 ? (
                                <span className="red">
                                    <FiArrowDown className="icon" />
                                    {data[0].price_change_percentage_24h.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            ) : (
                                <span className="green">
                                    <FiArrowUp className="icon" />
                                    {data[0].price_change_percentage_24h.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            )}
                        </div>

                        <div className="card">
                            <div className="top">
                                <img src={data[1].image} alt="" />
                            </div>

                            <div>
                                <h5>{data[1].name}</h5>
                                <p>${data[1].current_price.toLocaleString()}</p>
                            </div>

                            {data[1].price_change_percentage_24h < 0 ? (
                                <span className="red">
                                    <FiArrowDown className="icon" />
                                    {data[1].price_change_percentage_24h.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            ) : (
                                <span className="green">
                                    <FiArrowUp className="icon" />
                                    {data[1].price_change_percentage_24h.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            )}
                        </div>

                        <div className="card">
                            <div className="top">
                                <img src={data[2].image} alt="" />
                            </div>

                            <div>
                                <h5>{data[2].name}</h5>
                                <p>${data[2].current_price.toLocaleString()}</p>
                            </div>

                            {data[2].price_change_percentage_24h < 0 ? (
                                <span className="red">
                                    <FiArrowDown className="icon" />
                                    {data[2].price_change_percentage_24h.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            ) : (
                                <span className="green">
                                    <FiArrowUp className="icon" />
                                    {data[2].price_change_percentage_24h.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            )}
                        </div>

                        <div className="card">
                            <div className="top">
                                <img src={data[3].image} alt="" />
                            </div>

                            <div>
                                <h5>{data[3].name}</h5>
                                <p>${data[3].current_price.toLocaleString()}</p>
                            </div>

                            {data[3].price_change_percentage_24h < 0 ? (
                                <span className="red">
                                    <FiArrowDown className="icon" />
                                    {data[3].price_change_percentage_24h.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            ) : (
                                <span className="green">
                                    <FiArrowUp className="icon" />
                                    {data[3].price_change_percentage_24h.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            )}
                        </div>

                        <div className="card">
                            <div className="top">
                                <img src={data[4].image} alt="" />
                            </div>

                            <div>
                                <h5>{data[4].name}</h5>
                                <p>${data[4].current_price.toLocaleString()}</p>
                            </div>

                            {data[4].price_change_percentage_24h < 0 ? (
                                <span className="red">
                                    <FiArrowDown className="icon" />
                                    {data[4].price_change_percentage_24h.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            ) : (
                                <span className="green">
                                    <FiArrowUp className="icon" />
                                    {data[4].price_change_percentage_24h.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            )}
                        </div>

                        <div className="card">
                            <div className="top">
                                <img src={data[5].image} alt="" />
                            </div>

                            <div>
                                <h5>{data[5].name}</h5>
                                <p>${data[5].current_price.toLocaleString()}</p>
                            </div>

                            {data[5].price_change_percentage_24h < 0 ? (
                                <span className="red">
                                    <FiArrowDown className="icon" />
                                    {data[5].price_change_percentage_24h.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            ) : (
                                <span className="green">
                                    <FiArrowUp className="icon" />
                                    {data[5].price_change_percentage_24h.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default CryptoAPI;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./CryptoAPI.css";
// import { FiArrowUp, FiArrowDown } from "react-icons/fi";
// import { CryptoState } from "../pages/CryptoContext";
// import { createTheme, MenuItem, Select, ThemeProvider } from "@mui/material";

// const darkTheme = createTheme({
//     palette: {
//         primary: {
//             main: "#fff",
//         },

//         mode: "dark",
//     },
// });

// const CryptoAPI = () => {
//     const [data, setData] = useState(null);
//     //use the setCurrency from contextAPI to change
//     const { currency, setCurrency } = CryptoState();

//     const url =
//         "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false";

//     //i think here with currency change need edit the dependecies in use effect
//     useEffect(() => {
//         axios
//             .get(url)
//             .then((response) => {
//                 setData(response.data);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }, []);

//     // use if statement to hide error
//     if (!data) return null;

//     return (
//         <ThemeProvider theme={darkTheme}>
//             <div className="cryptoAPI">
//                 <div className="container">
//                     {/* left */}
//                     <div className="left">
//                         <h2>
//                             Check Out Latest Prices Of Cryptocurrencies Here
//                         </h2>
//                         <div className="with-currency">
//                             <button className="btn">Explore More Coins</button>

//                             <Select
//                                 variant="outlined"
//                                 style={{
//                                     width: 130,
//                                     height: 50,
//                                 }}
//                                 sx={{
//                                     "& .MuiOutlinedInput-notchedOutline": {
//                                         borderColor: "rgb(0, 255, 242)",
//                                     },
//                                     "& .MuiSvgIcon-root": {
//                                         color: "rgb(0, 255, 242)",
//                                     },
//                                     marginLeft: { xs: "0px", md: "20px" },
//                                 }}
//                                 value={currency}
//                                 onChange={(e) => setCurrency(e.target.value)}
//                             >
//                                 <MenuItem value={"USD"}>USD</MenuItem>
//                                 <MenuItem value={"SGD"}>SGD</MenuItem>
//                             </Select>
//                         </div>
//                     </div>

//                     {/* right */}
//                     <div className="right">
//                         <div className="card">
//                             <div className="top">
//                                 <img src={data[0].image} alt="" />
//                             </div>

//                             <div>
//                                 <h5>{data[0].name}</h5>
//                                 <p>${data[0].current_price.toLocaleString()}</p>
//                             </div>

//                             {data[0].price_change_percentage_24h < 0 ? (
//                                 <span className="red">
//                                     <FiArrowDown className="icon" />
//                                     {data[0].price_change_percentage_24h.toFixed(
//                                         2
//                                     )}
//                                     %
//                                 </span>
//                             ) : (
//                                 <span className="green">
//                                     <FiArrowUp className="icon" />
//                                     {data[0].price_change_percentage_24h.toFixed(
//                                         2
//                                     )}
//                                     %
//                                 </span>
//                             )}
//                         </div>

//                         <div className="card">
//                             <div className="top">
//                                 <img src={data[1].image} alt="" />
//                             </div>

//                             <div>
//                                 <h5>{data[1].name}</h5>
//                                 <p>${data[1].current_price.toLocaleString()}</p>
//                             </div>

//                             {data[1].price_change_percentage_24h < 0 ? (
//                                 <span className="red">
//                                     <FiArrowDown className="icon" />
//                                     {data[1].price_change_percentage_24h.toFixed(
//                                         2
//                                     )}
//                                     %
//                                 </span>
//                             ) : (
//                                 <span className="green">
//                                     <FiArrowUp className="icon" />
//                                     {data[1].price_change_percentage_24h.toFixed(
//                                         2
//                                     )}
//                                     %
//                                 </span>
//                             )}
//                         </div>

//                         <div className="card">
//                             <div className="top">
//                                 <img src={data[2].image} alt="" />
//                             </div>

//                             <div>
//                                 <h5>{data[2].name}</h5>
//                                 <p>${data[2].current_price.toLocaleString()}</p>
//                             </div>

//                             {data[2].price_change_percentage_24h < 0 ? (
//                                 <span className="red">
//                                     <FiArrowDown className="icon" />
//                                     {data[2].price_change_percentage_24h.toFixed(
//                                         2
//                                     )}
//                                     %
//                                 </span>
//                             ) : (
//                                 <span className="green">
//                                     <FiArrowUp className="icon" />
//                                     {data[2].price_change_percentage_24h.toFixed(
//                                         2
//                                     )}
//                                     %
//                                 </span>
//                             )}
//                         </div>

//                         <div className="card">
//                             <div className="top">
//                                 <img src={data[3].image} alt="" />
//                             </div>

//                             <div>
//                                 <h5>{data[3].name}</h5>
//                                 <p>${data[3].current_price.toLocaleString()}</p>
//                             </div>

//                             {data[3].price_change_percentage_24h < 0 ? (
//                                 <span className="red">
//                                     <FiArrowDown className="icon" />
//                                     {data[3].price_change_percentage_24h.toFixed(
//                                         2
//                                     )}
//                                     %
//                                 </span>
//                             ) : (
//                                 <span className="green">
//                                     <FiArrowUp className="icon" />
//                                     {data[3].price_change_percentage_24h.toFixed(
//                                         2
//                                     )}
//                                     %
//                                 </span>
//                             )}
//                         </div>

//                         <div className="card">
//                             <div className="top">
//                                 <img src={data[4].image} alt="" />
//                             </div>

//                             <div>
//                                 <h5>{data[4].name}</h5>
//                                 <p>${data[4].current_price.toLocaleString()}</p>
//                             </div>

//                             {data[4].price_change_percentage_24h < 0 ? (
//                                 <span className="red">
//                                     <FiArrowDown className="icon" />
//                                     {data[4].price_change_percentage_24h.toFixed(
//                                         2
//                                     )}
//                                     %
//                                 </span>
//                             ) : (
//                                 <span className="green">
//                                     <FiArrowUp className="icon" />
//                                     {data[4].price_change_percentage_24h.toFixed(
//                                         2
//                                     )}
//                                     %
//                                 </span>
//                             )}
//                         </div>

//                         <div className="card">
//                             <div className="top">
//                                 <img src={data[5].image} alt="" />
//                             </div>

//                             <div>
//                                 <h5>{data[5].name}</h5>
//                                 <p>${data[5].current_price.toLocaleString()}</p>
//                             </div>

//                             {data[5].price_change_percentage_24h < 0 ? (
//                                 <span className="red">
//                                     <FiArrowDown className="icon" />
//                                     {data[5].price_change_percentage_24h.toFixed(
//                                         2
//                                     )}
//                                     %
//                                 </span>
//                             ) : (
//                                 <span className="green">
//                                     <FiArrowUp className="icon" />
//                                     {data[5].price_change_percentage_24h.toFixed(
//                                         2
//                                     )}
//                                     %
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </ThemeProvider>
//     );
// };

// export default CryptoAPI;

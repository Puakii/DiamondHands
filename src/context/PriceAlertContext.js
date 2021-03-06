import React, { createContext, useEffect, useState, useContext } from "react";
import { useCryptoState } from "./CryptoContext";
import axios from "axios";
import { CoinList } from "../config/api";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

const Alert = createContext();

const PriceAlertContext = ({ children }) => {
    const [usdPriceReached, setUsdPriceReached] = useState([]);
    const [sgdPriceReached, setSgdPriceReached] = useState([]);
    const [usdCoins, setUsdCoins] = useState(null);
    const [sgdCoins, setSgdCoins] = useState(null);
    const [usdAlert, setUsdAlert] = useState([]);
    const [sgdAlert, setSgdAlert] = useState([]);
    const [isAlert, setIsAlert] = useState(false);

    const { session } = useCryptoState();

    //useEffect to set up listener
    useEffect(() => {
        const alertListener = supabase
            .from("price_alert")
            .on("*", (payload) => {
                // console.log("Change received!", payload);
                mainTriggerFunction();
            })

            .subscribe((status) => console.log(status));

        //clean up
        return () => {
            supabase.removeSubscription(alertListener);
        };
    }, []);

    //function to fetch latest cryptoprices from coingecko
    function refreshPrices() {
        axios
            .get(CoinList("USD"))
            .then((response) => {
                setUsdCoins(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        axios
            .get(CoinList("SGD"))
            .then((response) => {
                setSgdCoins(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    //function to get user's alert from back end
    const getAlert = async (currency) => {
        try {
            const user = supabase.auth.user();

            let { data, error, status } = await supabase
                .from("price_alert")
                .select("*")
                .eq("user_id", user?.id)
                .eq("currency", currency);

            if (error && status !== 406) {
                throw error;
            }

            // if (data.length !== 0) {
            if (currency === "USD") {
                setUsdAlert(data);
            } else {
                setSgdAlert(data);
            }
            // }
        } catch (error) {
            alert(error.message);
        }
    };

    function mainTriggerFunction() {
        refreshPrices();
        getAlert("USD");
        getAlert("SGD");
    }

    //Useeffect to call main trigger function
    useEffect(() => {
        if (session) {
            mainTriggerFunction();

            const timerId = setInterval(() => {
                mainTriggerFunction();
            }, 10000);
            return function cleanup() {
                clearInterval(timerId);
            };
        }
    }, [session]);

    //function to compare if price target has been reached
    const compare = (usdData, sgdData, usdPrice, sgdPrice) => {
        var newSgdArray = [];
        var newUsdArray = [];
        const usdMapper = new Map();
        const sgdMapper = new Map();
        usdData.map((coin) => usdMapper.set(coin.id, coin.current_price));
        sgdData.map((coin) => sgdMapper.set(coin.id, coin.current_price));

        for (let i = 0; i < usdPrice.length; i++) {
            const currPrice = usdMapper.get(usdPrice[i].coin_id);
            const equality = usdPrice[i].equality_sign;

            //to check if below price target
            if (equality === "lower") {
                if (currPrice < usdPrice[i].price) {
                    newUsdArray = [...newUsdArray, usdPrice[i]];
                }
            } else {
                //to check if above price target
                if (currPrice > usdPrice[i].price) {
                    newUsdArray = [...newUsdArray, usdPrice[i]];
                }
            }
        }
        for (let i = 0; i < sgdPrice.length; i++) {
            const currPrice = sgdMapper.get(sgdPrice[i].coin_id);
            const equality = sgdPrice[i].equality_sign;

            //to check if below price target
            if (equality === "lower") {
                if (currPrice < sgdPrice[i].price) {
                    newSgdArray = [...newSgdArray, sgdPrice[i]];
                }
            } else {
                if (currPrice > sgdPrice[i].price) {
                    newSgdArray = [...newSgdArray, sgdPrice[i]];
                }
            }
        }

        if (!arraysEqual(usdPriceReached, newUsdArray)) {
            setUsdPriceReached(newUsdArray);
        }

        if (!arraysEqual(sgdPriceReached, newSgdArray)) {
            setSgdPriceReached(newSgdArray);
        }
    };

    //function to check if 2 arrays are semantically equal
    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    //Use effect to trigger comparefunction
    useEffect(() => {
        if (
            usdCoins &&
            sgdCoins
            // (sgdAlert.length !== 0 || usdAlert.length !== 0)
        ) {
            compare(usdCoins, sgdCoins, usdAlert, sgdAlert);

            // const timerId = setInterval(() => {
            //     compare(usdCoins, sgdCoins, usdAlert, sgdAlert);
            // }, 20000);
            // return function cleanup() {
            //     clearInterval(timerId);
            // };
        }
    }, [usdCoins, sgdCoins, sgdAlert, usdAlert]);

    useEffect(() => {
        if (usdPriceReached.length !== 0 || sgdPriceReached.length !== 0) {
            setIsAlert(true);
        } else {
            setIsAlert(false);
        }
    }, [usdPriceReached, sgdPriceReached]);

    function toastFunction() {
        const user = supabase.auth.user();

        if (user && isAlert) {
            toast("You have new price target reached!");
        }
    }

    useEffect(() => {
        toastFunction();
        const timerId = setInterval(() => {
            toastFunction();
        }, 20000);
        return function cleanup() {
            clearInterval(timerId);
        };
    }, [isAlert]);

    return (
        <Alert.Provider
            value={{
                usdAlert,
                sgdAlert,
                usdPriceReached,
                sgdPriceReached,
                setUsdPriceReached,
                setSgdPriceReached,
                isAlert,
            }}
        >
            {children}
        </Alert.Provider>
    );
};

export default PriceAlertContext;

export const useAlertState = () => {
    return useContext(Alert);
};

//v2
// import React, { createContext, useEffect, useState, useContext } from "react";
// import { useCryptoState } from "./CryptoContext";
// import axios from "axios";
// import { CoinList } from "../config/api";
// import { supabase } from "../supabaseClient";
// import toast from "react-hot-toast";

// const Alert = createContext();

// const PriceAlertContext = ({ children }) => {
//     const [usdPriceReached, setUsdPriceReached] = useState([]);
//     const [sgdPriceReached, setSgdPriceReached] = useState([]);
//     const [usdCoins, setUsdCoins] = useState(null);
//     const [sgdCoins, setSgdCoins] = useState(null);
//     const [usdAlert, setUsdAlert] = useState([]);
//     const [sgdAlert, setSgdAlert] = useState([]);
//     const [isAlert, setIsAlert] = useState(false);

//     const { session } = useCryptoState();

//     //useEffect to set up listener
//     useEffect(() => {
//         const alertListener = supabase
//             .from("price_alert")
//             .on("*", (payload) => {
//                 console.log("Change received!", payload);
//                 mainTriggerFunction();
//             })

//             .subscribe((status) => console.log(status));

//         //clean up
//         return () => {
//             supabase.removeSubscription(alertListener);
//         };
//     }, []);

//     //function to fetch latest cryptoprices from coingecko
//     function refreshPrices() {
//         axios
//             .get(CoinList("USD"))
//             .then((response) => {
//                 setUsdCoins(response.data);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//         axios
//             .get(CoinList("SGD"))
//             .then((response) => {
//                 setSgdCoins(response.data);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }
//     //function to get user's alert from back end
//     const getAlert = async (currency) => {
//         try {
//             const user = supabase.auth.user();

//             let { data, error, status } = await supabase
//                 .from("price_alert")
//                 .select("*")
//                 .eq("user_id", user.id)
//                 .eq("currency", currency);

//             if (error && status !== 406) {
//                 throw error;
//             }

//             // if (data.length !== 0) {
//             if (currency === "USD") {
//                 setUsdAlert(data);
//             } else {
//                 setSgdAlert(data);
//             }
//             // }
//         } catch (error) {
//             alert(error.message);
//         }
//     };

//     function mainTriggerFunction() {
//         console.log("called");
//         refreshPrices();
//         getAlert("USD");
//         getAlert("SGD");
//     }

//     //Useeffect to call main trigger function
//     useEffect(() => {
//         if (session) {
//             mainTriggerFunction();

//             const timerId = setInterval(() => {
//                 mainTriggerFunction();
//             }, 20000);
//             return function cleanup() {
//                 clearInterval(timerId);
//             };
//         }
//     }, [session]);

//     //function to compare if price target has been reached
//     const compare = (usdData, sgdData, usdPrice, sgdPrice) => {
//         console.log("compared called");
//         var newSgdArray = [];
//         var newUsdArray = [];
//         const usdMapper = new Map();
//         const sgdMapper = new Map();
//         usdData.map((coin) => usdMapper.set(coin.id, coin.current_price));
//         sgdData.map((coin) => sgdMapper.set(coin.id, coin.current_price));

//         for (let i = 0; i < usdPrice.length; i++) {
//             const currPrice = usdMapper.get(usdPrice[i].coin_id);
//             const equality = usdPrice[i].equality_sign;

//             //to check if below price target
//             if (equality === "lower") {
//                 if (currPrice < usdPrice[i].price) {
//                     newUsdArray = [...newUsdArray, usdPrice[i]];
//                 }
//             } else {
//                 //to check if above price target
//                 if (currPrice > usdPrice[i].price) {
//                     newUsdArray = [...newUsdArray, usdPrice[i]];
//                 }
//             }
//         }
//         for (let i = 0; i < sgdPrice.length; i++) {
//             const currPrice = sgdMapper.get(sgdPrice[i].coin_id);
//             const equality = sgdPrice[i].equality_sign;

//             //to check if below price target
//             if (equality === "lower") {
//                 if (currPrice < sgdPrice[i].price) {
//                     newSgdArray = [...newSgdArray, sgdPrice[i]];
//                 }
//             } else {
//                 if (currPrice > sgdPrice[i].price) {
//                     newSgdArray = [...newSgdArray, sgdPrice[i]];
//                 }
//             }
//         }

//         if (!arraysEqual(usdPriceReached, newUsdArray)) {
//             setUsdPriceReached(newUsdArray);
//         }

//         if (!arraysEqual(sgdPriceReached, newSgdArray)) {
//             setSgdPriceReached(newSgdArray);
//         }
//     };

//     //function to check if 2 arrays are semantically equal
//     function arraysEqual(a, b) {
//         if (a === b) return true;
//         if (a == null || b == null) return false;
//         if (a.length !== b.length) return false;

//         for (var i = 0; i < a.length; ++i) {
//             if (a[i] !== b[i]) return false;
//         }
//         return true;
//     }

//     //Use effect to trigger comparefunction
//     useEffect(() => {
//         console.log("trigger for compare");
//         if (
//             usdCoins &&
//             sgdCoins
//             // (sgdAlert.length !== 0 || usdAlert.length !== 0)
//         ) {
//             compare(usdCoins, sgdCoins, usdAlert, sgdAlert);

//             // const timerId = setInterval(() => {
//             //     compare(usdCoins, sgdCoins, usdAlert, sgdAlert);
//             // }, 20000);
//             // return function cleanup() {
//             //     clearInterval(timerId);
//             // };
//         }
//     }, [usdCoins, sgdCoins, sgdAlert, usdAlert]);

//     const [trigger, setTrigger] = useState(true);

//     useEffect(() => {
//         if (usdPriceReached.length !== 0 || sgdPriceReached.length !== 0) {
//             setIsAlert(true);
//         } else {
//             setIsAlert(false);
//         }
//         setTrigger(!trigger);
//     }, [usdPriceReached, sgdPriceReached]);

//     useEffect(() => {
//         console.log("triggered");
//         if (isAlert) {
//             toast("You have new price target reached!");
//         }
//         // }, [isAlert]);
//     }, [trigger]);

//     return (
//         <Alert.Provider
//             value={{
//                 usdPriceReached,
//                 sgdPriceReached,
//                 setUsdPriceReached,
//                 setSgdPriceReached,
//                 isAlert,
//             }}
//         >
//             {children}
//         </Alert.Provider>
//     );
// };

// export default PriceAlertContext;

// export const useAlertState = () => {
//     return useContext(Alert);
// };

//v1
// import React, { createContext, useEffect, useState, useContext } from "react";
// import { useCryptoState } from "./CryptoContext";
// import axios from "axios";
// import { CoinList } from "../config/api";
// import { supabase } from "../supabaseClient";
// import toast from "react-hot-toast";

// const Alert = createContext();

// const PriceAlertContext = ({ children }) => {
//     const [usdPriceReached, setUsdPriceReached] = useState([]);
//     const [sgdPriceReached, setSgdPriceReached] = useState([]);
//     const [usdCoins, setUsdCoins] = useState(null);
//     const [sgdCoins, setSgdCoins] = useState(null);
//     const [usdAlert, setUsdAlert] = useState([]);
//     const [sgdAlert, setSgdAlert] = useState([]);
//     const [isAlert, setIsAlert] = useState(false);

//     const { session } = useCryptoState();

//     //useEffect to set up listener
//     useEffect(() => {
//         const alertListener = supabase
//             .from("price_alert")
//             .on("*", (payload) => {
//                 console.log("Change received!", payload);
//                 mainTriggerFunction();
//             })

//             .subscribe((status) => console.log(status));

//         //clean up
//         return () => {
//             supabase.removeSubscription(alertListener);
//         };
//     }, []);

//     //function to fetch latest cryptoprices from coingecko
//     function refreshPrices() {
//         axios
//             .get(CoinList("USD"))
//             .then((response) => {
//                 setUsdCoins(response.data);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//         axios
//             .get(CoinList("SGD"))
//             .then((response) => {
//                 setSgdCoins(response.data);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }
//     //function to get user's alert from back end
//     const getAlert = async (currency) => {
//         try {
//             const user = supabase.auth.user();

//             let { data, error, status } = await supabase
//                 .from("price_alert")
//                 .select("*")
//                 .eq("user_id", user.id)
//                 .eq("currency", currency);

//             if (error && status !== 406) {
//                 throw error;
//             }

//             // if (data.length !== 0) {
//             if (currency === "USD") {
//                 setUsdAlert(data);
//             } else {
//                 setSgdAlert(data);
//             }
//             // }
//         } catch (error) {
//             alert(error.message);
//         }
//     };

//     function mainTriggerFunction() {
//         console.log("called");
//         refreshPrices();
//         getAlert("USD");
//         getAlert("SGD");
//     }

//     //Useeffect to call main trigger function
//     useEffect(() => {
//         if (session) {
//             mainTriggerFunction();

//             const timerId = setInterval(() => {
//                 mainTriggerFunction();
//             }, 1000);
//             return function cleanup() {
//                 clearInterval(timerId);
//             };
//         }
//     }, [session]);

//     //function to compare if price target has been reached
//     const compare = (usdData, sgdData, usdPrice, sgdPrice) => {
//         console.log("compared called");
//         var newSgdArray = [];
//         var newUsdArray = [];
//         const usdMapper = new Map();
//         const sgdMapper = new Map();
//         usdData.map((coin) => usdMapper.set(coin.id, coin.current_price));
//         sgdData.map((coin) => sgdMapper.set(coin.id, coin.current_price));

//         for (let i = 0; i < usdPrice.length; i++) {
//             const currPrice = usdMapper.get(usdPrice[i].coin_id);
//             const equality = usdPrice[i].equality_sign;

//             //to check if below price target
//             if (equality === "lower") {
//                 if (currPrice < usdPrice[i].price) {
//                     newUsdArray = [...newUsdArray, usdPrice[i]];
//                 }
//             } else {
//                 //to check if above price target
//                 if (currPrice > usdPrice[i].price) {
//                     newUsdArray = [...newUsdArray, usdPrice[i]];
//                 }
//             }
//         }
//         for (let i = 0; i < sgdPrice.length; i++) {
//             const currPrice = sgdMapper.get(sgdPrice[i].coin_id);
//             const equality = sgdPrice[i].equality_sign;

//             //to check if below price target
//             if (equality === "lower") {
//                 if (currPrice < sgdPrice[i].price) {
//                     newSgdArray = [...newSgdArray, sgdPrice[i]];
//                 }
//             } else {
//                 if (currPrice > sgdPrice[i].price) {
//                     newSgdArray = [...newSgdArray, sgdPrice[i]];
//                 }
//             }
//         }

//         setUsdPriceReached(newUsdArray);
//         setSgdPriceReached(newSgdArray);
//     };

//     //Use effect to trigger comparefunction
//     useEffect(() => {
//         console.log("trigger for compare");
//         if (
//             usdCoins &&
//             sgdCoins
//             // (sgdAlert.length !== 0 || usdAlert.length !== 0)
//         ) {
//             compare(usdCoins, sgdCoins, usdAlert, sgdAlert);

//             // const timerId = setInterval(() => {
//             //     compare(usdCoins, sgdCoins, usdAlert, sgdAlert);
//             // }, 20000);
//             // return function cleanup() {
//             //     clearInterval(timerId);
//             // };
//         }
//     }, [usdCoins, sgdCoins, sgdAlert, usdAlert]);

//     const [trigger, setTrigger] = useState(true);

//     useEffect(() => {
//         if (usdPriceReached.length !== 0 || sgdPriceReached.length !== 0) {
//             setIsAlert(true);
//         } else {
//             setIsAlert(false);
//         }
//         setTrigger(!trigger);
//     }, [usdPriceReached, sgdPriceReached]);

//     useEffect(() => {
//         console.log("triggered");
//         if (isAlert) {
//             toast("You have new price target reached!");
//         }
//         // }, [isAlert]);
//     }, [trigger]);

//     return (
//         <Alert.Provider
//             value={{
//                 usdPriceReached,
//                 sgdPriceReached,
//                 setUsdPriceReached,
//                 setSgdPriceReached,
//                 isAlert,
//             }}
//         >
//             {children}
//         </Alert.Provider>
//     );
// };

// export default PriceAlertContext;

// export const useAlertState = () => {
//     return useContext(Alert);
// };

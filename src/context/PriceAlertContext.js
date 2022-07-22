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
    // const [stopper, setStopper] = useState(false);

    const { session } = useCryptoState();

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

    const getAlert = async (currency) => {
        try {
            const user = supabase.auth.user();

            let { data, error, status } = await supabase
                .from("price_alert")
                .select("*")
                .eq("user_id", user.id)
                .eq("currency", currency);

            if (error && status !== 406) {
                throw error;
            }

            // console.log(data);

            if (data.length !== 0) {
                if (currency === "USD") {
                    setUsdAlert(data);
                } else {
                    setSgdAlert(data);
                }
            }
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        if (session) {
            refreshPrices();
            getAlert("USD");
            getAlert("SGD");

            const timerId = setInterval(() => {
                refreshPrices();
                getAlert("USD");
                getAlert("SGD");
            }, 20000);
            return function cleanup() {
                clearInterval(timerId);
            };
        }
    }, [session]);

    const compare = (usdData, sgdData, usdPrice, sgdPrice) => {
        var newSgdArray = [];
        var newUsdArray = [];
        const usdMapper = new Map();
        const sgdMapper = new Map();
        usdData.map((coin) => usdMapper.set(coin.id, coin.current_price));
        sgdData.map((coin) => sgdMapper.set(coin.id, coin.current_price));

        for (let i = 0; i < usdPrice.length; i++) {
            const currPrice = usdMapper.get(usdPrice[i].coin_id);
            if (currPrice < usdPrice[i].price) {
                newUsdArray = [...newUsdArray, usdPrice[i]];
                // toast(
                //     usdPrice[i].coin +
                //         " is trading below " +
                //         usdPrice[i].price +
                //         " now!",
                //     { duration: 5000 }
                // );
            }
        }
        for (let i = 0; i < sgdPrice.length; i++) {
            const currPrice = sgdMapper.get(sgdPrice[i].coin_id);

            if (currPrice < sgdPrice[i].price) {
                newSgdArray = [...newSgdArray, sgdPrice[i]];
            }

            setUsdPriceReached(newUsdArray);
            setSgdPriceReached(newSgdArray);
        }
    };

    useEffect(() => {
        if (
            usdCoins &&
            sgdCoins &&
            (sgdAlert.length !== 0 || usdAlert.length !== 0)
        ) {
            compare(usdCoins, sgdCoins, usdAlert, sgdAlert);

            const timerId = setInterval(() => {
                compare(usdCoins, sgdCoins, usdAlert, sgdAlert);
            }, 20000);
            return function cleanup() {
                clearInterval(timerId);
            };
        }
    }, [usdCoins, sgdCoins, sgdAlert, usdAlert]);

    const [isAlert, setIsAlert] = useState(false);

    useEffect(() => {
        if (usdPriceReached.length !== 0 || sgdPriceReached.length !== 0) {
            setIsAlert(true);
        } else {
            setIsAlert(false);
        }
    }, [usdPriceReached, sgdPriceReached]);

    useEffect(() => {
        if (isAlert) {
            toast("You have new price target reached!", { duration: 3000 });
        }
    }, [isAlert]);

    return (
        <Alert.Provider
            value={{
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

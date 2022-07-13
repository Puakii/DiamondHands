import axios from "axios";
import React, { useState, useEffect } from "react";
import { useCryptoState } from "../../pages/CryptoContext";
import "./Carousel.css";
import "../../config/api";
import { TrendingCoins } from "../../config/api";
import "react-alice-carousel/lib/alice-carousel.css";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";

const Carousel = () => {
    const [trendingData, setTrendingData] = useState(null);

    //get currency from contextAPI
    const { currency, symbol } = useCryptoState();

    function refreshPrices(currency) {
        axios
            .get(TrendingCoins(currency))
            .then((response) => {
                setTrendingData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        refreshPrices(currency);
        const timerId = setInterval(() => refreshPrices(currency), 20000);
        return function cleanup() {
            clearInterval(timerId);
        };
    }, [currency]);

    // use if statement to hide error
    if (!trendingData) return null;

    const items = trendingData.map((coin) => {
        return (
            //can use anchor tag also?
            <Link className="carouselItem" to={`/coins/${coin.id}`}>
                <img
                    src={coin.image}
                    alt={coin.name}
                    height="80"
                    style={{ marginBottom: 10 }}
                />
                <span style={{ color: "white" }}>{coin.symbol}</span>
                {coin.price_change_percentage_24h < 0 ? (
                    <span className="red">
                        {coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                ) : (
                    <span className="green">
                        +{coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                )}

                <span style={{ fontSize: 22, fontWeight: 500 }}>
                    {symbol}
                    {coin.current_price.toLocaleString()}
                </span>
            </Link>
        );
    });

    const responsive = {
        //above 0 pixel display 2 items
        0: {
            items: 2,
        },
        //above 512 pixel display 4 items
        512: {
            items: 4,
        },
    };

    return (
        <div className="carousel">
            <AliceCarousel
                mouseTracking={false}
                touchTracking={false}
                autoPlayStrategy={"none"}
                infinite
                autoPlayInterval={1000}
                animationDuration={1500}
                disableDotsControls
                disableButtonsControls
                responsive={responsive}
                autoPlay
                items={items}
            />
        </div>
    );
};

export default Carousel;

import {
    Box,
    Button,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../supabaseClient";
import { useCryptoState } from "../../context/CryptoContext";

const Alert = ({ coinId }) => {
    const [price, setPrice] = useState(0);

    //get from contextAPI
    const { currency, setCurrency, session } = useCryptoState();

    const handlePriceAlert = async () => {
        if (!session) {
            toast.error("Please sign in to access this feature!");
            return;
        }

        if (price === "") {
            toast.error("Please key in a price target");
            return;
        }

        //parse the string into a float
        const alertPrice = parseFloat(price).toFixed(5);

        if (alertPrice < 0) {
            toast.error("Please key in a valid price target");
            return;
        }

        try {
            const user = supabase.auth.user();

            //no single() as ideally we want them to be able to add multiple alerts => return us a []
            //from the id column, select the data that meet the user_id and coin_id filter

            const { data, error, status } = await supabase
                .from("price_alert")
                .select("id")
                .eq("user_id", user.id)
                .eq("coin", coinId);

            if (error && status !== 406) {
                throw error;
            }

            if (data.length !== 0) {
                const { error2 } = await supabase
                    .from("price_alert")
                    .update({
                        currency: currency,
                        price: alertPrice,
                    })
                    .match({ id: data[0].id });
                if (error2) throw error2;
                toast.success("Successfully updated your price alert!");
            } else {
                const { error2 } = await supabase.from("price_alert").insert([
                    {
                        user_id: user.id,
                        coin: coinId,
                        currency: currency,
                        price: alertPrice,
                    },
                ]);

                if (error2) throw error2;
                toast.success("Successfully added to your price alert!");
            }
        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

    return (
        <>
            {" "}
            <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                    <Typography
                        className="price"
                        fontSize="1rem"
                        color="whitesmoke"
                        fontWeight="700"
                    >
                        {"Alert me when the price is: "}
                    </Typography>
                    <Select
                        variant="outlined"
                        sx={{
                            width: 80,
                            height: 30,
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgb(0, 255, 242)",
                            },
                            "& .MuiSvgIcon-root": {
                                color: "rgb(0, 255, 242)",
                            },
                            marginLeft: {
                                xs: "9%",
                                md: "7%",
                            },
                        }}
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <MenuItem value={"USD"}>USD</MenuItem>
                        <MenuItem value={"SGD"}>SGD</MenuItem>
                    </Select>
                </Box>
                <Box>
                    <TextField
                        type="number"
                        name="alertPrice"
                        // label="Price"
                        // variant="filled"
                        sx={{ marginTop: "10px" }}
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                    />
                    <Button
                        sx={{
                            margin: "20px",
                        }}
                        variant="outlined"
                        onClick={() => handlePriceAlert()}
                    >
                        Send
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default Alert;

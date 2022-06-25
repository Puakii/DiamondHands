import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import VisuallyHidden from "@reach/visually-hidden";
import { Avatar, Box } from "@mui/material";

export default function AccountAvatar({ url, username, onUpload }) {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    const downloadImage = async (path) => {
        try {
            const { data, error } = await supabase.storage
                .from("avatars")
                .download(path);
            if (error) {
                throw error;
            }

            const url = URL.createObjectURL(data);
            setAvatarUrl(url);
        } catch (error) {
            console.log("Error downloading image: ", error.message);
        }
    };

    useEffect(() => {
        if (url) downloadImage(url);
    }, [url]);

    const uploadAvatar = async (event) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            //get the first file that is uploaded
            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            onUpload(filePath);
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box
            display="flex"
            paddingTop="0.7rem"
            paddingLeft="1.3rem"
            alignItems="center"
        >
            <Avatar
                alt={"avatar"}
                //change here
                src={avatarUrl}
                sx={{
                    marginRight: "1rem",
                    height: "50px",
                    width: "50px",
                }}
            >
                {username.toUpperCase().charAt(0)}
            </Avatar>

            {uploading ? (
                "Uploading..."
            ) : (
                <>
                    <label
                        className="button primary block"
                        htmlFor="single"
                        style={{
                            border: "1px solid",
                            borderRadius: "10px",
                            borderColor: "rgba(0, 255, 242, 0.596)",
                            backgroundColor: "rgba(0, 255, 242, 0.596)",
                            height: "35px",
                            width: "130px",
                            color: "white",
                            paddingLeft: "5px",
                            paddingTop: "3px",
                        }}
                    >
                        Upload Avatar
                    </label>

                    <VisuallyHidden>
                        {/* image taken in as input */}
                        <input
                            type="file"
                            id="single"
                            accept="image/*"
                            onChange={uploadAvatar}
                            disabled={uploading}
                        />
                    </VisuallyHidden>
                </>
            )}
        </Box>
    );
}

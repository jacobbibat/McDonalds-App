'use client';

import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { green } from "@mui/material/colors";

//Bottom Nav
import BottomNav from "../components/BottomNav";

export default function Page() {

    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('/api/getProducts')
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    if (!data) return <p>Loading...</p>;

    const theme = createTheme({
        palette: { secondary: { main: green[500] } }
    });

    // ---------------------------
    // ADD TO CART HANDLER
    // ---------------------------
    async function handleAddToCart(productId) {

        const userId = localStorage.getItem("userId"); // logged in user

        if (!userId) {
            alert("You must be logged in.");
            return;
        }

        const res = await fetch("/api/addToCart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId })
        });

        const data = await res.json();
        alert(data.message);
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">

                <div style={{ fontSize: "40px", marginBottom: "20px" }}>
                    Dashboard
                </div>

                <div>
                    {data.map((item) => (
                        <div
                            key={item._id}
                            style={{
                                padding: "20px",
                                borderBottom: "1px solid #ccc"
                            }}
                        >
                            <b>{item.name}</b><br />
                            {item.description}<br />
                            <b>€{item.price}</b>
                            <br /><br />

                            <Button
                                variant="outlined"
                                onClick={() => handleAddToCart(item._id)}
                            >
                                Add to cart
                            </Button>
                        </div>
                    ))}
                </div>

            </Container>

            <BottomNav />
        </ThemeProvider>
    );
}

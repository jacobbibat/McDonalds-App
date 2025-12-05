'use client';

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function ViewCartPage() {

    const [cart, setCart] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadCart();
    }, []);

    async function loadCart() {

        // TEMP user ID — replace later with real logged in user
        const userId = "test-user-1";

        const res = await fetch("/api/getCart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId })
        });

        const data = await res.json();

        if (!data.success) {
            setMessage("Your cart is empty.");
        } else {
            setCart(data.cart);
        }
    }

    async function removeItem(productId) {
        const userId = localStorage.getItem("userId");

        const res = await fetch("/api/removeFromCart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId })
        });

        const data = await res.json();

        setMessage(data.message);
        loadCart();
    }

    if (!cart) {
        return (
            <Container maxWidth="xs" style={{ marginTop: "40px" }}>
                <h1>View Cart</h1>
                <p>{message}</p>
            </Container>
        );
    }

    // Calculate total
    const total = cart.items.reduce((sum, item) => {
        return sum + item.qty * item.price;
    }, 0);

    return (
        <Container maxWidth="xs" style={{ marginTop: "40px" }}>
            <h1>Your Cart</h1>

            {cart.items.map((item, i) => (
                <Box
                    key={i}
                    style={{
                        padding: "15px",
                        borderBottom: "1px solid #ccc",
                        marginBottom: "10px"
                    }}
                >
                    <Typography><strong>{item.name}</strong></Typography>
                    <Typography>Qty: {item.qty}</Typography>
                    <Typography>Price: €{item.price}</Typography>
                    <Typography>
                        Subtotal: €{(item.qty * item.price).toFixed(2)}
                    </Typography>

                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        style={{ marginTop: "10px" }}
                        onClick={() => removeItem(item.productId)}
                    >
                        Remove
                    </Button>
                </Box>
            ))}

            <Typography style={{ marginTop: "20px", fontSize: "20px" }}>
                <strong>Total: €{total.toFixed(2)}</strong>
            </Typography>

            <Button
                fullWidth
                variant="contained"
                style={{ marginTop: "20px" }}
            >
                Checkout
            </Button>

            {message && (
                <p style={{ marginTop: "15px", color: "green" }}>{message}</p>
            )}
        </Container>
    );
}

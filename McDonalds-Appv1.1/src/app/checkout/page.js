'use client';

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function CheckoutPage() {

    const [cart, setCart] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadCart();
    }, []);

    async function loadCart() {
        const userId = localStorage.getItem("userId");

        const res = await fetch("/api/getCart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });

        const data = await res.json();

        if (!data.success) {
            setMessage("Your cart is empty.");
            return;
        }

        setCart(data.cart);
    }

    async function confirmOrder() {

        const userId = localStorage.getItem("userId");

        const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });

        const data = await res.json();

        if (!data.success) {
            setMessage(data.message);
            return;
        }

        setMessage("Order placed successfully!");

        // Redirect to dashboard or order history
        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 1200);
    }

    if (!cart) {
        return (
            <Container maxWidth="xs" style={{ marginTop: "40px" }}>
                <h1>Checkout</h1>
                <p>{message}</p>
            </Container>
        );
    }

    const total = cart.items.reduce((sum, item) => {
        return sum + item.qty * item.price;
    }, 0);

    return (
        <Container maxWidth="xs" style={{ marginTop: "40px" }}>
            <h1>Checkout</h1>

            {cart.items.map((item) => (
                <div
                    key={item.productId}
                    style={{ padding: "10px", borderBottom: "1px solid #ccc" }}
                >
                    <Typography><strong>{item.name}</strong></Typography>
                    <Typography>Qty: {item.qty}</Typography>
                    <Typography>Price: €{item.price}</Typography>
                </div>
            ))}

            <Typography style={{ marginTop: "20px", fontSize: "20px" }}>
                <strong>Total: €{total.toFixed(2)}</strong>
            </Typography>

            <Button
                fullWidth
                variant="contained"
                style={{ marginTop: "20px" }}
                onClick={confirmOrder}
            >
                Confirm Order
            </Button>

            {message && (
                <p style={{ marginTop: "15px", color: "green" }}>{message}</p>
            )}
        </Container>
    );
}

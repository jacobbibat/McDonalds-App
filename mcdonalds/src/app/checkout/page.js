'use client';

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function CheckoutPage() {

    const [cart, setCart] = useState(null);
    const [total, setTotal] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [promotion, setPromotion] = useState(null);

    useEffect(() => {
        loadCart();
    }, []);

    async function loadCart() {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await fetch("/api/getCart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });

        const data = await res.json();

        if (data.success) {
            setCart(data.cart);
            setTotal(data.total);
            setDiscountAmount(data.discountAmount);
            setFinalTotal(data.finalTotal);
            setPromotion(data.promotion);
        }
    }

    async function confirmOrder() {
        const userId = localStorage.getItem("userId");

        const res = await fetch("/api/confirmOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });

        const data = await res.json();

        if (data.success) {
            window.location.href = "/orders?thankyou=true";
        } else {
            alert("Unable to place order.");
        }
    }

    if (!cart) return <p>Loading...</p>;

    return (
        <Container maxWidth="xs" style={{ marginTop: "40px" }}>
            <h1>Checkout</h1>

            {cart.items.map((item, index) => (
                <Box
                    key={index}
                    style={{
                        borderBottom: "1px solid #ccc",
                        padding: "10px",
                        marginBottom: "5px"
                    }}
                >
                    <Typography><strong>{item.name}</strong></Typography>
                    <Typography>Qty: {item.qty}</Typography>
                    <Typography>Price: €{item.price}</Typography>
                </Box>
            ))}

            {/* TOTALS */}
            <Typography style={{ marginTop: "20px" }}>
                Subtotal: €{total.toFixed(2)}
            </Typography>

            {discountAmount > 0 && (
                <Typography style={{ color: "green" }}>
                    Promotion Applied ({promotion}): –€{discountAmount.toFixed(2)}
                </Typography>
            )}

            <Typography style={{ fontSize: "22px", marginTop: "10px" }}>
                <strong>Final Total: €{finalTotal.toFixed(2)}</strong>
            </Typography>

            {/* BUTTONS */}
            <Box style={{ marginTop: "25px", display: "flex", flexDirection: "column", gap: "12px" }}>

                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={confirmOrder}
                >
                    Confirm Order
                </Button>

                <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    onClick={() => window.location.href = "/view_cart"}
                >
                    Edit Order
                </Button>
            </Box>
        </Container>
    );
}

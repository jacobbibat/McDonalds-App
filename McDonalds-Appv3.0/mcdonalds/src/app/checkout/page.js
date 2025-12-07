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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCart();
    }, []);

    async function loadCart() {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setLoading(false);
            return;
        }

        const res = await fetch("/api/getCart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });

        const data = await res.json();
        setLoading(false);

        if (!data.success) {
            setCart(null);
            return;
        }

        setCart(data.cart);
        setTotal(data.total);
        setDiscountAmount(data.discountAmount);
        setFinalTotal(data.finalTotal);
        setPromotion(data.promotion);
    }

    async function confirmOrder() {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await fetch("/api/createOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });

        const data = await res.json();

        if (data.success) {
            // Redirect to orders with thank you message
            window.location.href = "/orders?thankyou=true";
        } else {
            alert(data.message);
        }
    }

    if (loading) return <p>Loading...</p>;

    if (!cart) {
        return (
            <Container maxWidth="xs" style={{ marginTop: "40px" }}>
                <h1>Checkout</h1>
                <p>Your cart is empty.</p>

                <Button
                    fullWidth
                    variant="contained"
                    style={{ marginTop: "20px" }}
                    onClick={() => window.location.href = "/dashboard"}
                >
                    Back to Home
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xs" style={{ marginTop: "40px" }}>
            <h1>Checkout</h1>

            {/* ITEMS LIST */}
            {cart.items.map((item, i) => (
                <Box
                    key={i}
                    style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        marginBottom: "10px"
                    }}
                >
                    <Typography><strong>{item.name}</strong></Typography>
                    <Typography>Qty: {item.qty}</Typography>
                    <Typography>Price: €{item.price.toFixed(2)}</Typography>
                </Box>
            ))}

            {/* SUBTOTAL */}
            <Typography style={{ marginTop: "15px" }}>
                Subtotal: €{total.toFixed(2)}
            </Typography>

            {/* DISCOUNT SECTION */}
            {discountAmount > 0 && (
                <Typography style={{ color: "green" }}>
                    Promotion Applied ({promotion}): -€{discountAmount.toFixed(2)}
                </Typography>
            )}

            {/* FINAL TOTAL */}
            <Typography style={{ fontSize: "22px", marginTop: "10px" }}>
                <strong>Final Total: €{finalTotal.toFixed(2)}</strong>
            </Typography>

            {/* EDIT ORDER BUTTON */}
            <Button
                fullWidth
                variant="outlined"
                style={{ marginTop: "20px", marginBottom: "10px" }}
                onClick={() => window.location.href = "/view_cart"}
            >
                Edit Order
            </Button>

            {/* CONFIRM ORDER BUTTON */}
            <Button
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
                onClick={confirmOrder}
            >
                Confirm Order
            </Button>
        </Container>
    );
}

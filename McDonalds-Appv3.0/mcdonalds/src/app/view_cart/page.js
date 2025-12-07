'use client';

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import BottomNav from "../components/BottomNav";

export default function ViewCartPage() {

    const [cart, setCart] = useState(null);
    const [message, setMessage] = useState("");

    const [promoInput, setPromoInput] = useState("");
    const [total, setTotal] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [promotion, setPromotion] = useState(null);

    useEffect(() => {
        loadCart();
    }, []);

    //removePromo function
    async function removePromo() {
        const userId = localStorage.getItem("userId");

        const res = await fetch("/api/removePromotion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });

        const data = await res.json();
        alert(data.message);

        loadCart(); // refresh totals & hide discount
    }


    // LOAD CART

    async function loadCart() {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            setMessage("You must be logged in.");
            return;
        }

        const res = await fetch("/api/getCart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });

        // If backend crashes, avoid JSON parse error
        let data;
        try {
            data = await res.json();
        } catch {
            setMessage("Error loading cart.");
            return;
        }

        if (!data.success || !data.cart || !data.cart.items) {
            setMessage("Your cart is empty.");
            return;
        }

        setCart(data.cart);
        setTotal(data.total);
        setDiscountAmount(data.discountAmount);
        setFinalTotal(data.finalTotal);
        setPromotion(data.promotion);
    }

    // ------------------------------
    // REMOVE ITEM
    // ------------------------------
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

    // UPDATE QUANTITY

    async function updateQty(productId, newQty) {

        if (newQty < 1) return;

        const userId = localStorage.getItem("userId");

        const res = await fetch("/api/updateCartItem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId, qty: newQty })
        });

        const data = await res.json();
        setMessage(data.message);

        loadCart();
    }


    // APPLY PROMOTION

    async function applyPromo() {
        const userId = localStorage.getItem("userId");

        const res = await fetch("/api/applyPromotion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, promoCode: promoInput })
        });

        const data = await res.json();
        alert(data.message);

        loadCart();
    }

    if (!cart) {
        return (
            <>
                <Container maxWidth="xs" style={{ marginTop: "40px" }}>
                    <h1>Your Cart</h1>
                    <p>{message}</p>
                </Container>

                <BottomNav />
            </>
        );
    }


    return (
        <>
        <Container maxWidth="xs" style={{ marginTop: "40px", marginBottom: "80px" }}>
            <h1>Your Cart</h1>

            {/* ITEMS */}
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
                    <Typography>Price: €{item.price}</Typography>

                    {/* QUANTITY CONTROLS */}
                    <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            variant="outlined"
                            onClick={() => updateQty(item.productId, item.qty - 1)}
                        > - </Button>

                        <Typography>{item.qty}</Typography>

                        <Button
                            variant="outlined"
                            onClick={() => updateQty(item.productId, item.qty + 1)}
                        > + </Button>
                    </div>

                    <Typography style={{ marginTop: "10px" }}>
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

            {/* PROMO SECTION */}
            <Box style={{ marginTop: "20px" }}>
                <Typography><strong>Have a promo code?</strong></Typography>

                <TextField
                    fullWidth
                    placeholder="Enter promo code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    style={{ marginTop: "10px" }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    onClick={applyPromo}
                    style={{ marginTop: "10px" }}
                >
                    Apply Code
                </Button>

                <Button
                    fullWidth
                    variant="outlined"
                    color="warning"
                    style={{ marginTop: "10px" }}
                    onClick={removePromo}
                >
                    Remove Promotion
                </Button>
            </Box>

            {/* TOTALS */}
            <Typography style={{ fontSize: "18px", marginTop: "20px" }}>
                Subtotal: €{total.toFixed(2)}
            </Typography>

            {discountAmount > 0 && (
                <Typography style={{ color: "green", marginTop: "5px" }}>
                    Promotion Applied ({promotion}) – €{discountAmount.toFixed(2)}
                </Typography>
            )}

            <Typography style={{ fontSize: "22px", marginTop: "10px" }}>
                <strong>Total: €{finalTotal.toFixed(2)}</strong>
            </Typography>

            {/* CHECKOUT BUTTON */}
            <Button
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: "25px" }}
                onClick={() => window.location.href = "/checkout"}
            >
                Proceed to Checkout
            </Button>

            {message && (
                <p style={{ marginTop: "15px", color: "green" }}>{message}</p>
            )}
        </Container>
    <BottomNav />
    </>
    );
}

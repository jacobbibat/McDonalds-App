'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// BOTTOM NAV
import BottomNav from "../components/BottomNav";

export default function OrdersPage() {

    const [orders, setOrders] = useState(null);
    const [message, setMessage] = useState("");

    const params = useSearchParams();
    const thankYou = params.get("thankyou") === "true";

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            setMessage("You must be logged in to view orders.");
            return;
        }

        const res = await fetch("/api/getOrders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });

        const data = await res.json();

        if (!data.success) {
            setMessage(data.message);
            return;
        }

        setOrders(data.orders);
    }

    if (!orders) {
        return (
            <Container maxWidth="xs" style={{ marginTop: "40px", marginBottom: "80px" }}>
                <h1>Your Orders</h1>

                {thankYou && (
                    <div style={{
                        background: "#d4edda",
                        color: "#155724",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        textAlign: "center",
                        fontWeight: "bold"
                    }}>
                        🎉 Thank you! Your order has been placed!
                    </div>
                )}

                <p>{message}</p>

                {/* BACK BUTTON */}
                <Button
                    fullWidth
                    variant="contained"
                    style={{ marginTop: "20px" }}
                    onClick={() => window.location.href = "/dashboard"}
                >
                    Back to Homepage
                </Button>

                <BottomNav />
            </Container>
        );
    }

    return (
        <>
            <Container maxWidth="xs" style={{ marginTop: "40px", marginBottom: "80px" }}>
                <h1>Your Orders</h1>

                {thankYou && (
                    <div style={{
                        background: "#d4edda",
                        color: "#155724",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        textAlign: "center",
                        fontWeight: "bold"
                    }}>
                        🎉 Thank you! Your order has been placed!
                    </div>
                )}

                {orders.length === 0 && (
                    <Typography>No previous orders found.</Typography>
                )}

                {orders.map((order, index) => (
                    <Box
                        key={index}
                        style={{
                            marginBottom: "20px",
                            padding: "15px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            backgroundColor: "#fafafa"
                        }}
                    >
                        <Typography variant="subtitle1">
                            <strong>Order #{index + 1}</strong>
                        </Typography>

                        <Typography>Status: {order.status}</Typography>

                        <Typography variant="body2" style={{ marginTop: "10px" }}>
                            <strong>Items:</strong>
                        </Typography>

                        {order.items.map((item, i) => (
                            <Typography key={i} style={{ marginLeft: "10px" }}>
                                {item.name} (x{item.qty}) — €{item.price}
                            </Typography>
                        ))}

                        <Typography style={{ marginTop: "10px" }}>
                            <strong>Total: €{order.total.toFixed(2)}</strong>
                        </Typography>

                        <Typography style={{ marginTop: "5px", fontSize: "12px" }}>
                            Ordered on: {new Date(order.createdAt).toLocaleString()}
                        </Typography>
                    </Box>
                ))}

                {/* BACK TO DASHBOARD BUTTON */}
                <Button
                    fullWidth
                    variant="contained"
                    style={{ marginTop: "10px" }}
                    onClick={() => window.location.href = "/dashboard"}
                >
                    Back to Homepage
                </Button>
            </Container>

            <BottomNav />
        </>
    );
}

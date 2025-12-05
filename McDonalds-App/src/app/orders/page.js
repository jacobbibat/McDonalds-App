'use client';

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function OrdersPage() {

    const [orders, setOrders] = useState(null);
    const [message, setMessage] = useState("");

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
            <Container maxWidth="xs" style={{ marginTop: "40px" }}>
                <h1>Your Orders</h1>
                <p>{message}</p>
            </Container>
        );
    }

    return (
        <Container maxWidth="xs" style={{ marginTop: "40px" }}>
            <h1>Your Orders</h1>

            {orders.map((order, index) => (
                <Box
                    key={index}
                    style={{
                        marginBottom: "20px",
                        padding: "15px",
                        border: "1px solid #ccc",
                        borderRadius: "5px"
                    }}
                >
                    <Typography variant="subtitle1">
                        <strong>Order #{index + 1}</strong>
                    </Typography>

                    <Typography>Status: {order.status}</Typography>

                    <Typography variant="body2" style={{ marginTop: "10px" }}>
                        Items:
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

        </Container>
    );
}

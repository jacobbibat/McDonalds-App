'use client';

import { useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ManagerBottomNav from "../../components/ManagerBottomNav";

export default function PromotionPage() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState("");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch("/api/addPromotion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, discount, code })
        });

        const data = await res.json();
        setMessage(data.message);
    }

    return (
        <>
            <Container maxWidth="xs" style={{ marginTop: "30px", marginBottom: "80px" }}>
                <h1>Add Promotion</h1>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Promotion Title"
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Promo Code (e.g., STUDENT10)"
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Discount (%)"
                        type="number"
                        onChange={(e) => setDiscount(e.target.value)}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        style={{ marginTop: "20px" }}
                    >
                        Save Promotion
                    </Button>

                    {message && (
                        <p style={{ marginTop: "15px", color: "green" }}>{message}</p>
                    )}
                </form>
            </Container>

            <ManagerBottomNav />
        </>
    );
}

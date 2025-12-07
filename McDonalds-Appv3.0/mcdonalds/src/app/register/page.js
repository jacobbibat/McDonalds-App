'use client';

import { useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function Page() {

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const update = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    async function handleRegister(e) {
        e.preventDefault();

        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (!data.success) {
            setMessage(data.message || "Registration failed");
        } else {
            setMessage("Registration successful!");

            // Redirect after 1 second
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        }
    }

    return (
        <Container maxWidth="xs" style={{ marginTop: "40px" }}>
            <h1>Register</h1>

            <form onSubmit={handleRegister}>
                <TextField
                    fullWidth margin="normal" label="First Name"
                    onChange={(e) => update("firstName", e.target.value)}
                />

                <TextField
                    fullWidth margin="normal" label="Last Name"
                    onChange={(e) => update("lastName", e.target.value)}
                />

                <TextField
                    fullWidth margin="normal" type="email" label="Email"
                    onChange={(e) => update("email", e.target.value)}
                />

                <TextField
                    fullWidth margin="normal" type="password" label="Password"
                    onChange={(e) => update("password", e.target.value)}
                />

                <Button
                    fullWidth variant="contained" type="submit"
                    style={{ marginTop: "20px" }}
                >
                    Create Account
                </Button>

                {message && (
                    <p style={{ marginTop: "15px", color: "green", fontWeight: "bold" }}>
                        {message}
                    </p>
                )}

                <p style={{ marginTop: "15px" }}>
                    Already registered?{" "}
                    <Link href="/login" style={{ color: "blue", textDecoration: "underline" }}>
                        Click here to login
                    </Link>
                </p>
            </form>
        </Container>
    );
}

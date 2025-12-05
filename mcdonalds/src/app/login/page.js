'use client';

import { useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function Page() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!data.success) {
            setMessage("Invalid email or password");
            return;
        }

        setMessage("Login successful!");

        //  SAVE USER DATA
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userRole", data.user.role);

        if (data.user.firstName) {
            localStorage.setItem("firstName", data.user.firstName);
        }

        //  ROLE-BASED REDIRECT
        setTimeout(() => {
            if (data.user.role === "admin") {
                window.location.href = "/manager";
            } else {
                window.location.href = "/dashboard";
            }
        }, 800);
    }

    return (
        <Container maxWidth="xs" style={{ marginTop: "40px" }}>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
                <TextField
                    fullWidth
                    margin="normal"
                    type="email"
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    type="password"
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    style={{ marginTop: "20px" }}
                >
                    Login
                </Button>

                {message && (
                    <p style={{ marginTop: "15px", color: "green", fontWeight: "bold" }}>
                        {message}
                    </p>
                )}

                <p style={{ marginTop: "15px" }}>
                    Not registered?{" "}
                    <Link href="/register" style={{ color: "blue", textDecoration: "underline" }}>
                        Click here
                    </Link>
                </p>
            </form>
        </Container>
    );
}

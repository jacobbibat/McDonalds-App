'use client';

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import BottomNav from "../components/BottomNav";

export default function SearchMenuPage() {

    const [menu, setMenu] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadMenu();
    }, []);

    async function loadMenu() {
        const res = await fetch("/api/getProducts");
        const data = await res.json();
        setMenu(data);
    }

    const filtered = menu.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Container maxWidth="xs" style={{ marginTop: "30px", marginBottom: "80px" }}>
                <h1>Search Menu</h1>

                <TextField
                    fullWidth
                    label="Search for items..."
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginBottom: "20px" }}
                />

                {filtered.length === 0 && (
                    <p>No matching items found.</p>
                )}

                {filtered.map(item => (
                    <Box
                        key={item._id}
                        style={{
                            padding: "15px",
                            borderBottom: "1px solid #ddd",
                            marginBottom: "10px"
                        }}
                    >
                        <b>{item.name}</b><br />
                        {item.description}<br />
                        <b>€{item.price}</b>

                        <Button
                            variant="outlined"
                            size="small"
                            style={{ marginTop: "10px" }}
                            onClick={() => alert("Add to cart later")}
                        >
                            Add to Cart
                        </Button>
                    </Box>
                ))}
            </Container>

            <BottomNav />
        </>
    );
}

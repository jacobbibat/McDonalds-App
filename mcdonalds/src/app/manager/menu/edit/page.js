<<<<<<< HEAD
"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import ManagerBottomNav from "../../../components/ManagerBottomNav";

export default function AddMenuItemPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const [available, setAvailable] = useState(true);

    const [message, setMessage] = useState("");

    const categories = [
        "burger",
        "chicken",
        "fries",
        "drink",
        "dessert",
        "breakfast"
    ];

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch("/api/addMenuItem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    description,
                    price,
                    category,
                    image,
                    available
                })
            });

            const data = await res.json();
            setMessage(data.message || "");

        } catch (err) {
            console.error("addMenuItem error:", err);
            setMessage("Error adding menu item.");
        }
    }

    return (
        <>
            <Container
                maxWidth="xs"
                style={{ marginTop: "40px", marginBottom: "90px" }}
            >
                <h1>Add Menu Item</h1>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Name"
                        margin="normal"
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        margin="normal"
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Price (€)"
                        margin="normal"
                        type="number"
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        select
                        label="Category"
                        margin="normal"
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        label="Image URL (optional)"
                        margin="normal"
                        onChange={(e) => setImage(e.target.value)}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={available}
                                onChange={() => setAvailable(!available)}
                            />
                        }
                        label="Available"
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        style={{ marginTop: "20px" }}
                    >
                        Add Item
                    </Button>

                    {message && (
                        <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
                    )}
                </form>
            </Container>

            <ManagerBottomNav />
        </>
    );
}
=======
'use client';

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import ManagerBottomNav from "../../../components/ManagerBottomNav";

export default function EditMenuItemPage() {

    const [item, setItem] = useState(null);
    const [message, setMessage] = useState("");

    const categories = ["burger", "chicken", "fries", "drink", "dessert", "breakfast"];

    useEffect(() => {
        const id = localStorage.getItem("editItemId");
        if (!id) return;

        loadItem(id);
    }, []);

    async function loadItem(id) {
        const res = await fetch("/api/getMenuItem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        const data = await res.json();
        setItem(data.item);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch("/api/updateMenuItem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
        });

        const data = await res.json();
        setMessage(data.message);
    }

    if (!item) return <p>Loading...</p>;

    return (
        <>
            <Container maxWidth="xs" style={{ marginTop: "40px", marginBottom: "90px" }}>
                <h1>Edit Menu Item</h1>

                <form onSubmit={handleSubmit}>

                    <TextField
                        fullWidth label="Name"
                        margin="normal"
                        value={item.name}
                        onChange={(e) => setItem({ ...item, name: e.target.value })}
                    />

                    <TextField
                        fullWidth label="Description"
                        margin="normal"
                        value={item.description}
                        onChange={(e) => setItem({ ...item, description: e.target.value })}
                    />

                    <TextField
                        fullWidth label="Price (€)"
                        type="number"
                        margin="normal"
                        value={item.price}
                        onChange={(e) => setItem({ ...item, price: e.target.value })}
                    />

                    <TextField
                        fullWidth select label="Category"
                        margin="normal"
                        value={item.category}
                        onChange={(e) => setItem({ ...item, category: e.target.value })}
                    >
                        {categories.map((cat, i) => (
                            <MenuItem key={i} value={cat}>{cat}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth label="Image URL"
                        margin="normal"
                        value={item.image}
                        onChange={(e) => setItem({ ...item, image: e.target.value })}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={item.available}
                                onChange={() => setItem({ ...item, available: !item.available })}
                            />
                        }
                        label="Available"
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        style={{ marginTop: "20px" }}
                    >
                        Save Changes
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
>>>>>>> 08dd84b4e3d4881e84356a3efff9a8fab9b19d88

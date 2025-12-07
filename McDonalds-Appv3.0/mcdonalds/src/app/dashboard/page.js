'use client';

import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import BottomNav from "../components/BottomNav";

export default function DashboardPage() {

    const [products, setProducts] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("default");

    const categories = [
        "all",
        "burger",
        "chicken",
        "fries",
        "drink",
        "dessert",
        "breakfast"
    ];

    useEffect(() => {
        loadProducts();
        loadPromotions();
    }, []);

    async function loadProducts() {
        const res = await fetch("/api/getProducts");
        const data = await res.json();
        setProducts(data);
    }

    async function loadPromotions() {
        const res = await fetch("/api/getPromotions");
        const data = await res.json();
        if (data.success) setPromotions(data.promotions);
    }

    async function handleAddToCart(productId) {
        const userId = localStorage.getItem("userId");
        if (!userId) return alert("You must be logged in.");

        const res = await fetch("/api/addToCart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId })
        });

        const data = await res.json();
        alert(data.message);
    }

    const theme = createTheme({
        palette: { secondary: { main: green[500] } }
    });

    if (!products.length) return <p>Loading...</p>;

    // FILTERING
    const filteredProducts = products.filter(item => {
        const matchSearch =
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase());

        const matchCategory =
            category === "all" || item.category === category;

        return matchSearch && matchCategory;
    });

    // SORTING
    let sortedProducts = [...filteredProducts];

    if (sort === "price-low")
        sortedProducts.sort((a, b) => a.price - b.price);

    if (sort === "price-high")
        sortedProducts.sort((a, b) => b.price - a.price);

    if (sort === "az")
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));

    if (sort === "za")
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" style={{ marginBottom: "95px" }}>

                {/* TITLE */}
                <h1 style={{ fontSize: "28px", marginBottom: "15px" }}>
                    Dashboard
                </h1>

                {/* PROMOTION BANNER */}
                {promotions.length > 0 && (
                    <Box
                        style={{
                            padding: "18px",
                            backgroundColor: "#fff4cc",
                            borderRadius: "12px",
                            border: "1px solid #ffcc55",
                            marginBottom: "25px",
                            textAlign: "center"
                        }}
                    >
                        <h3 style={{ margin: 0 }}>🔥 {promotions[0].title}</h3>
                        <p style={{ margin: "6px 0" }}>{promotions[0].description}</p>
                        <b>{promotions[0].discount}% OFF</b>
                    </Box>
                )}

                {/* SEARCH BAR */}
                <TextField
                    fullWidth
                    label="Search menu..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginBottom: "15px" }}
                />

                {/* SORTING DROPDOWN */}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}
                >
                    <option value="default">Sort By</option>
                    <option value="price-low">Price: Low → High</option>
                    <option value="price-high">Price: High → Low</option>
                    <option value="az">A → Z</option>
                    <option value="za">Z → A</option>
                </select>

                {/* CATEGORY FILTER */}
                <Box
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "20px",
                        justifyContent: "center"
                    }}
                >
                    {categories.map((cat) => (
                        <Chip
                            key={cat}
                            label={cat}
                            clickable
                            onClick={() => setCategory(cat)}
                            color={category === cat ? "primary" : "default"}
                        />
                    ))}
                </Box>

                {/* PRODUCT LIST */}
                <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Menu</h2>

                {sortedProducts.map((item) => (
                    <Box
                        key={item._id}
                        style={{
                            padding: "15px",
                            borderBottom: "1px solid #ccc",
                            display: "flex",
                            flexDirection: "row",
                            gap: "10px"
                        }}
                    >
                        {/* PRODUCT IMAGE */}
                        <img
                            src={item.image || "/placeholder-food.png"}
                            alt={item.name}
                            width="80"
                            height="80"
                            style={{
                                objectFit: "cover",
                                borderRadius: "10px",
                                border: "1px solid #ddd"
                            }}
                        />

                        {/* DETAILS */}
                        <div style={{ flex: 1 }}>
                            <b>{item.name}</b><br />
                            <small>{item.description}</small><br />
                            <b>€{item.price}</b>

                            <Button
                                variant="outlined"
                                size="small"
                                style={{ marginTop: "10px" }}
                                onClick={() => handleAddToCart(item._id)}
                            >
                                Add to cart
                            </Button>
                        </div>
                    </Box>
                ))}

                {sortedProducts.length === 0 && (
                    <p style={{ marginTop: "20px", textAlign: "center" }}>
                        No items found.
                    </p>
                )}

            </Container>

            <BottomNav />
        </ThemeProvider>
    );
}

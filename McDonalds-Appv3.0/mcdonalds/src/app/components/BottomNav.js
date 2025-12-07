'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

export default function BottomNav() {
    const [value, setValue] = React.useState(0);
    const [weather, setWeather] = React.useState(null);

    const fetchWeather = async () => {
        try {
            const res = await fetch("/api/weather", {
                method: "POST",
                body: JSON.stringify({ location: "Dublin" })
            });

            const data = await res.json();
            if (data.weather) {
                setWeather(data.weather.current);
            }
        } catch (err) {
            console.error("Weather fetch error:", err);
        }
    };

    React.useEffect(() => {
        fetchWeather();
    }, []);

    return (
        <Box
            sx={{
                width: '100%',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                borderTop: '1px solid #ccc',
                backgroundColor: '#fff',
                zIndex: 1000,
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => setValue(newValue)}
                >
                    <BottomNavigationAction
                        label="Home"
                        icon={<HomeIcon />}
                        onClick={() => window.location.href = "/dashboard"}
                    />

                    <BottomNavigationAction
                        label="Search"
                        icon={<SearchIcon />}
                        onClick={() => window.location.href = "/search"}
                    />

                    <BottomNavigationAction
                        label="Cart"
                        icon={<ShoppingCartIcon />}
                        onClick={() => window.location.href = "/view_cart"}
                    />

                    <BottomNavigationAction
                        label="Orders"
                        icon={<ReceiptIcon />}
                        onClick={() => window.location.href = "/orders"}
                    />
                </BottomNavigation>

                {/* WEATHER DISPLAY ON FAR RIGHT */}
                <Box
                    sx={{
                        position: 'absolute',
                        right: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#333'
                    }}
                >
                    <WbSunnyIcon sx={{ fontSize: 20, marginRight: 0.5 }} />
                    {weather ? `${weather.temp_c}°C` : "--°C"}
                </Box>
            </Box>
        </Box>
    );
}

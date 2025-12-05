'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';

export default function BottomNav() {
    const [value, setValue] = React.useState(0);

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
        </Box>
    );
}

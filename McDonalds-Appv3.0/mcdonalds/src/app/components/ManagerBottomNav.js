'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import AssessmentIcon from '@mui/icons-material/Assessment'; // Metrics
import LocalOfferIcon from '@mui/icons-material/LocalOffer'; // Promotion
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'; // Menu mgmt (optional)

export default function ManagerBottomNav() {
    const [value, setValue] = React.useState(0);

    return (
        <Box
            sx={{
                width: '100%',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                borderTop: "1px solid #ccc",
                backgroundColor: "#fff",
                zIndex: 1000
            }}
        >
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => setValue(newValue)}
            >
                <BottomNavigationAction
                    label="Orders"
                    icon={<AssessmentIcon />}
                    onClick={() => window.location.href = "/manager"}
                />
                <BottomNavigationAction
                    label="Metrics"
                    icon={<AssessmentIcon />}
                    onClick={() => window.location.href = "/manager/metrics"}
                />

                <BottomNavigationAction
                    label="Add Promotion"
                    icon={<LocalOfferIcon />}
                    onClick={() => window.location.href = "/manager/promotion"}
                />

                <BottomNavigationAction
                    label="Manage Menu"
                    icon={<RestaurantMenuIcon />}
                    onClick={() => window.location.href = "/manager/menu"}
                />
            </BottomNavigation>
        </Box>
    );
}

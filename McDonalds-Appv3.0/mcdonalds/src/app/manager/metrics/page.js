"use client";

import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import ManagerBottomNav from "../../components/ManagerBottomNav";

export default function SimpleCharts() {
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);

    const loadMetrics = async () => {
        const res = await fetch("/api/metrics");
        const data = await res.json();

        setLabels(data.labels);
        setValues(data.values);
    };

    useEffect(() => {
        loadMetrics();
    }, []);

    return (
        <div
            style={{
                paddingBottom: "80px", // ensures chart is not hidden behind bottom nav
                padding: "20px"
            }}
        >
            <h2 style={{ marginBottom: "20px" }}>
                Orders in the Last 7 Days
            </h2>

            <BarChart
                xAxis={[
                    {
                        id: "days",
                        data: labels,
                    },
                ]}
                series={[
                    {
                        data: values,
                    },
                ]}
                height={300}
            />
            <ManagerBottomNav />
        </div>
    );
}

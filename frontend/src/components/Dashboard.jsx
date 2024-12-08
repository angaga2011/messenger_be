import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessage(res.data.message);
            } catch (err) {
                setMessage("Failed to fetch dashboard data");
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>{message}</p>
        </div>
    );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import { getContract } from "../lib/contract.js";

const GetTime = () => {
    const [currentTime, setCurrentTime] = useState('');
    
    useEffect(() => {
        const fetchTime = async () => {
            try {
                const contract = await getContract();
                const data = await contract.getTime();
                const time = data.toString();
                console.log("Current Time:", time);
                setCurrentTime(time);
            } catch (error) {
                console.error("Error details:", error);
                console.error("Error message:", error.message);
                console.error("Error code:", error.code);
            }
        };
        fetchTime();
    }, []);

    return (
        <div>
            <h1>Current Blockchain Time</h1>
            <p>{currentTime ? new Date(Number(currentTime) * 1000).toLocaleString() : "Loading..."}</p>
        </div>
    );
}

export default GetTime;
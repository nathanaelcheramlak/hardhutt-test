import { useState, useEffect } from 'react';
import { getContract } from "../lib/contract.js";

const GetElections = () => {
    const [elections, setElections] = useState([]);
    
    useEffect(() => {
        const fetchElections = async () => {
            try {
                const contract = await getContract();
                const data = await contract.getTime();
                const time = data.toString();
                // console.log("Response: ", time);
                // setElections(data);
            } catch (error) {
                console.log("Error: ", error);
            }
        };
        fetchElections();
    }, [])

    return (
        <div>
            <h1>Elections</h1>
            {elections}
        </div>
    )
}

export default GetElections;
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios";

function BackendHandShake() {
    const [message, setmessage]=useState("")
    useEffect(
        ()=>{
            // connection working checking 
            const Connection =async()=>{
                try {
                    const response = await axios.get("http://localhost:8080/api");
                    console.log("Server ka jawab:", response.data);
                    setmessage(response.data.message || response.data);
                } catch (error) {
                    console.log("connection lost", error.message)
                }
            };
Connection();
        },[]);
  return (
    <div>
      <h1>Status: {message ? message : "Connecting..."}</h1>
    </div>
  )
}

export default BackendHandShake

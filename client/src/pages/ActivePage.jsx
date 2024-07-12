import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/ActivePage.css'
const ActivePage = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
    const [verify , setVerify] = useState(false);
  const handleVerify = async () => {
    try {
      const response = await axios.get(`http://localhost:8800/api/auth/activate/${token}`);
      setMessage(response.data.message);
      setVerify(true);
    } catch (error) {
      setMessage(error.response.data.message || "Error activating account");
    }
  };

  return (
    <div className="verify-app" >
      {!verify &&<button onClick={handleVerify}>Verify</button>}
      {verify && <p>Verify Successful</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default ActivePage;
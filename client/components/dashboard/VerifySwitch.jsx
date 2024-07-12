import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import axios from 'axios';
const VerifySwitch = () => {
  const { user } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      if (user.status === 'active') {
        setIsChecked(true);
        setIsDisabled(true);
      }
    }
  }, [user]);

  const handleToggle = async () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      try {
        const res = await axios.post('http://localhost:8800/api/auth/send-activation-email', { email: user.email });
        setMessage(res.data.message);
      } catch (error) {
        setMessage('Error sending activation email');
        setIsChecked(false);
        console.error('Error sending activation email', error);
      }
    }
  };

  return (
    <div>
      <label className="switch">
        <input type="checkbox" checked={isChecked} onChange={handleToggle} disabled={isDisabled} />
        <span className="slider round"></span>
      </label>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifySwitch;
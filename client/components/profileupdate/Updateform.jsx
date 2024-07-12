import React, { useState } from 'react';
import UpdateNav from '../userprofile/UpdateNav';
import '../../styles/UpdateForm.css'; // Adjust path as per your project
import InforNav from '../userprofile/InforNav';
import { useAuth } from '../../context/AuthProvider';

const UpdateForm = () => {
  const [selectedForm, setSelectedForm] = useState('name');
  const [isOpenName, setIsOpenName] = useState(false);
  const [isOpenPhone, setIsOpenPhone] = useState(false);
  const [isOpenEmail, setIsOpenEmail] = useState(false);
  const [isOpenPassword, setIsOpenPassword] = useState(false);
  const { user } = useAuth();

  const handleOpen = (formType) => {
    switch (formType) {
      case 'name':
        setIsOpenName(true);
        setIsOpenPhone(false);
        setIsOpenEmail(false);
        setIsOpenPassword(false);
        setSelectedForm('name');
        break;
      case 'phone':
        setIsOpenName(false);
        setIsOpenPhone(true);
        setIsOpenEmail(false);
        setIsOpenPassword(false);
        setSelectedForm('phone');
        break;
      case 'email':
        setIsOpenName(false);
        setIsOpenPhone(false);
        setIsOpenEmail(true);
        setIsOpenPassword(false);
        setSelectedForm('email');
        break;
      case 'password':
        setIsOpenName(false);
        setIsOpenPhone(false);
        setIsOpenEmail(false);
        setIsOpenPassword(true);
        setSelectedForm('password');
        break;
      default:
        break;
    }
  };

  return (
    <div className="user-profile">
      <h2>User Information</h2>
      <div className="nav-choose">
        {!isOpenName ? (
          <div onClick={() => handleOpen('name')}>
            <InforNav formType="name" userInfo={user} onClick={() => handleOpen('name')} />
          </div>
        ) : (
          <UpdateNav formType={selectedForm} onClose={() => setIsOpenName(false)} />
        )}
        {!isOpenPhone ? (
          <div onClick={() => handleOpen('phone')}>
            <InforNav formType="phone" userInfo={user} onClick={() => handleOpen('phone')} />
          </div>
        ) : (
          <UpdateNav formType={selectedForm} onClose={() => setIsOpenPhone(false)} />
        )}
        {!isOpenEmail ? (
          <div onClick={() => handleOpen('email')}>
            <InforNav formType="email" userInfo={user} onClick={() => handleOpen('email')} />
          </div>
        ) : (
          <UpdateNav formType={selectedForm} onClose={() => setIsOpenEmail(false)} />
        )}
        {!isOpenPassword ? (
          <div onClick={() => handleOpen('password')}>
            <InforNav formType="password" userInfo={user} onClick={() => handleOpen('password')} />
          </div>
        ) : (
          <UpdateNav formType={selectedForm} onClose={() => setIsOpenPassword(false)} />
        )}
      </div>
    </div>
  );
};

export default UpdateForm;

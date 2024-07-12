import React from "react";
import { useAuth } from "../../context/AuthProvider";
import '../../styles/Thumnail.css'
export default function Thumbnail(props){
    const defaultUserImg = '/clone.jpg'
    const {user} = useAuth();

    return <div className="thumbnail-container" onClick={props.onClick} style={props.style}>         <img style={props.style} src={user ? (user.img?user.img:defaultUserImg) : defaultUserImg} alt="User Thumbnail" />
</div>
}
import React, { useState } from 'react';
import { Button } from "./ui/button";
import { User } from "lucide-react";

export const UserProfileSimple = () => {
  const [clicked, setClicked] = useState(false);
  
  const handleClick = () => {
    setClicked(true);
    alert('User Profile Clicked! This proves the component is working.');
    console.log('UserProfile component is working!');
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative group"
      onClick={handleClick}
      style={{ backgroundColor: clicked ? '#ff0000' : 'transparent' }}
    >
      <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
      {clicked && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
      )}
    </Button>
  );
};
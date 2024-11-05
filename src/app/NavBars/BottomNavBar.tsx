"use client"

import React, { useEffect, useState } from 'react';
import BottomNav from './service-provider-bottomBar';
import ConsumerBottomNav from './consumer-bottomBar';

const BottomNavBar = () => {
  const [role, setRole] = useState<string | null>(null);

  // Function to update role based on localStorage value
  const updateRoleFromLocalStorage = () => {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    if (roles.includes('provider')) {
      setRole('provider');
    } else if (roles.includes('consumer')) {
      setRole('consumer');
    } else {
      setRole('consumer');  // Optional: default role
    }
  };

  useEffect(() => {
    // Initial role setup from localStorage
    updateRoleFromLocalStorage();

    // Listener for role changes via custom "roleSwitched" event
    const handleRoleSwitch = () => {
      updateRoleFromLocalStorage();
    };

    // Add the event listener for role changes
    window.addEventListener('roleSwitched', handleRoleSwitch);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('roleSwitched', handleRoleSwitch);
    };
  }, []);

  return (
    <>
      {role === 'provider' && <BottomNav />}
      {role === 'consumer' && <ConsumerBottomNav />}
    </>
  );
};

export default BottomNavBar;

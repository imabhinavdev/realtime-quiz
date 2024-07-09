// Context for user data
"use client"
import React, { createContext, useEffect, useState } from 'react';

// The data will be stored in the context at login time
export const UserContext = createContext();

// The provider will be used to wrap the app
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const lsUser = JSON.parse(user);
            setUser(lsUser);
        }
        setLoading(false);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const setAuthData = (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
};

export const getAuthData = () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return {
        user: user ? JSON.parse(user) : null,
        token: token || null
    };
};

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

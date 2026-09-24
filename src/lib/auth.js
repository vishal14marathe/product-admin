export const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

export const setToken = (token) => {
    if (typeof window !== 'undefined') localStorage.setItem('auth_token', token);
};

export const clearToken = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('auth_token');
};

export const isLoggedIn = () => Boolean(getToken());
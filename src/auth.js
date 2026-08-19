const AUTH_KEY = 'mma_user';

export function getStoredUser() {
    try {
        const raw = localStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function storeUser(user) {
    const safe = {
        id: user.id,
        email: user.email,
        userName: user.userName,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(safe));
    return safe;
}

export function clearStoredUser() {
    localStorage.removeItem(AUTH_KEY);
}

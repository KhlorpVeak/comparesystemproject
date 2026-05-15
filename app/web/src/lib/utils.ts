export function getAccessToken() {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : null;
}

export function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

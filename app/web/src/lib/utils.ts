export function getAccessToken() {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : null;
}

export function cn(...inputs: any[]) {
    // This is a common utility in shadcn setups, adding it just in case it's needed later
    return inputs.filter(Boolean).join(' ');
}

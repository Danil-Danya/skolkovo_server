export const normalizeTelegramUsername = (username?: string): string | null => {
    if (!username) {
        return null;
    }

    const normalizedUsername = username.trim().replace(/^@+/, "");
    return normalizedUsername.length > 0 ? normalizedUsername : null;
}
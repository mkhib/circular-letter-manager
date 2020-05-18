export const isAuthenticated = (req) => {
    if (!req.userId) {
        throw new Error("Authentication required")
    }

    return req.userId.userId;
}
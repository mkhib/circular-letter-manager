export const sendRefreshToken = (res, token) => {
    res.cookie("jwt", token, {
        httpOnly: true,
        path: "/refresh_token"
    });
};
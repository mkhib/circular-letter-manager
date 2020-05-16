// import { sign } from 'jsonwebtoken';

// export const createAccessToken = (id) => {
//     return sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET, {
//         expiresIn: "15m"
//     });
// };

// export const createRefreshToken = (id, tokenVersion) => {
//     return sign(
//         { userId: id, tokenVersion: tokenVersion },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: "7d"
//         }
//     );
// };
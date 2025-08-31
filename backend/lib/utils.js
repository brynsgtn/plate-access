// Import dependency: jsonwebtoken is used to create and verify JWT tokens
import jwt from "jsonwebtoken";

// Function to generate a JWT token and set it in an HTTP-only cookie
export const generateToken = (userId, res) => {
    // 1. Create a token signed with the user's ID as payload
    //    - { userId } is the data stored inside the token
    //    - process.env.JWT_SECRET is your secret key (used to sign/verify tokens)
    //    - expiresIn: "7d" means token is valid for 7 days
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // 2. Check if the app is running in production (live server) or development (local machine)
    const isProduction = process.env.NODE_ENV === "production";

    // 3. Attach the token to the response as a cookie
    //    - Name of the cookie: "jwt"
    //    - Value: token we just created
    //    - Options:
    //        maxAge: 7 days (in milliseconds)
    //        httpOnly: true => cookie cannot be accessed by JavaScript (prevents XSS attacks)
    //        sameSite: 
    //            - "None" for production (required if frontend/backend are on different domains, e.g., Netlify + Render)
    //            - "Lax" for local development (less strict, works on localhost)
    //        secure: true in production => cookie only sent over HTTPS (not plain HTTP)
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        httpOnly: true,
        sameSite: isProduction ? "None" : "Lax",  // Safari-safe
        secure: isProduction,                    // Only secure on HTTPS
    });

    // 4. Return the token (in case we also want to send it in the response body)
    return token;
};
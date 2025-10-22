// Import dependency: jsonwebtoken is used to create and verify JWT tokens
import jwt from "jsonwebtoken";

// Function to generate a JWT token with role-based expiration
export const generateToken = (userId, role, res) => {
    // Define expiration times based on role
    let expiresIn;
    let maxAge;
    
    if (role === "admin" || role === "itAdmin") {
        // Admin and IT Admin: 1 hour
        expiresIn = "1h";
        maxAge = 1 * 60 * 1000; // 1 hour in milliseconds
    } else {
        // Parking Staff: 8 hours
        expiresIn = "8h";
        maxAge = 2 * 60 * 1000; // 8 hours in milliseconds
    } 
    // 1. Create a token signed with the user's ID and role as payload
    //    - { userId, role } is the data stored inside the token
    //    - process.env.JWT_SECRET is your secret key (used to sign/verify tokens)
    //    - expiresIn: Dynamic based on role
    const token = jwt.sign(
        { userId, role }, // Include role in payload for verification
        process.env.JWT_SECRET,
        { expiresIn }
    );

    // 2. Check if the app is running in production (live server) or development (local machine)
    const isProduction = process.env.NODE_ENV === "production";

    // 3. Attach the token to the response as a cookie
    //    - Name of the cookie: "jwt"
    //    - Value: token we just created
    //    - Options:
    //        maxAge: Dynamic based on role (matches token expiration)
    //        httpOnly: true => cookie cannot be accessed by JavaScript (prevents XSS attacks)
    //        sameSite: 
    //            - "None" for production (required if frontend/backend are on different domains)
    //            - "Lax" for local development (less strict, works on localhost)
    //        secure: true in production => cookie only sent over HTTPS (not plain HTTP)
    res.cookie("jwt", token, {
        maxAge, // Dynamic: 15 min for admin/itAdmin, 2 hours for parkingStaff, 7 days for others
        httpOnly: true,
        sameSite: isProduction ? "None" : "Lax",
        secure: isProduction,
    });

    // 4. Return the token (in case we also want to send it in the response body)
    return token;
};
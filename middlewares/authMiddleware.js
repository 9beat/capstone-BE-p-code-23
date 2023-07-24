import jwt from 'jsonwebtoken';

//*##################################################
// TODO<---- IMPROVE_SECURITY_CONTROLS ---->#########
//*##################################################
export const verifyToken = async (req, res, next) => {
    try {
        // extract header value
        let token = req.header("Authorization")
        
        // verify token exists
        if (!token) {
            return res.status(403)
                .send("No token provided")
        }

        // decode header
        if (token.startsWith("Bearer ")) {
            //* token = token.substring(7) + "Bearer " + token.substring(7)
            token = token.substring(7, token.length).trim()
            // token = token.slice(7, token.length).trimLeft()
        }
        
        // handle token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // add user id to req object
        req.user = verified;
        // pass over
        next();
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
};
//*##################################################
// TODO<---- IMPROVE_SECURITY_CONTROLS ---->#########
//*##################################################
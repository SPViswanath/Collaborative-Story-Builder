const jwt = require("jsonwebtoken");
const authMiddleware = (req,res,next)=>{
    
    try{

        //1. Format: "Bearer Token"
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized-No Token"});
        }

        //2. Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        //3.Attach userId to request

        req.userId = decoded.userId;

        //4.Continue to Controller

        next();
    }
    catch(err){
        return res.status(401).json({message:"Invalid or expired token"});
    }
}

module.exports = authMiddleware;
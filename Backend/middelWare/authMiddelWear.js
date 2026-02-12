import jwt from "jsonwebtoken";

const authMiddelWear= (req, res, next)=>{
let token = req.cookies.token;

// If token not in cookies, try Authorization header (for testing)
if (!token && req.headers.authorization) {
  const authHeader = req.headers.authorization;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7); // Remove 'Bearer ' prefix
  }
}
if(!token){
    return res.status(401).json({
              success: false,
      massage: "Session Time Out, Please Login again",
    });
}
try {
     const tokenDcode= jwt.verify(token, process.env.JWT_SECRET); 
    if(tokenDcode.id){
        req.userId = tokenDcode.id;
    }else{
         return res.status(401).json({
              success: false,
      massage: "Not Authrized log in again",
     });
    }
     next();
    } catch (error) {
        return res.status(401).json({
              success: false,
      massage: "Session Time Out, Please Login again",
    });
    }

};
export default authMiddelWear;

//req.body.userId
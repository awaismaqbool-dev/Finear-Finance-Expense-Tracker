import jwt from "jsonwebtoken";

const authMiddelWear= (req, res, next)=>{
const {token}=req.cookies;
if(!token){
    return res.status(401).json({
              success: false,
      massage: "Session Time Out, Please Login again",
    });
}
try {
     const tokenDcode= jwt.verify(token, process.env.JWT_SECRET); 
    if(tokenDcode.id){
        req.body.userId = tokenDcode.id;
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
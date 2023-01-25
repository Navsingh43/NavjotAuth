const JWT=require("jsonwebtoken")
module.exports= async (req,res,next)=>{
    const token=req.cookies.mbt;

    if(!token){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "No token found",
                }
            ]
        })
    }
    try{
    let user=await JWT.verify(token,"45rtijrgioter4ltj45tkwer")
    req.user=user.email;
    next();
    }
    catch(error){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "Token invalid",
                }
            ]
        })
    }
}
const { request, response } = require("express"); 
import jwt  from 'jsonwebtoken'; 

export const validarJWT = (req=request, resp=response, next:Function)=>{ 
    const token = req.header('accessToken');
    if(!token){
        return resp.status(401).json(
            {
                status:false,
                msg:'No se detecta el accessToken'
            }
        );
    }

    try {
        const { uid }:any = jwt.verify(token, process.env.JWT_SECRET || "1234"  )  ; 
        req.params.uid = uid;
        next();
    } catch (error) {
        return resp.status(401).json(
            {
                status:false,
                msg:'No se detecta el accessToken'
            }
        );
    }


} 
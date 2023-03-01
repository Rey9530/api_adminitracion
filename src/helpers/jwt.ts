import jwt from 'jsonwebtoken';

export const getenerarJWT = ( uid:number ) =>{
    return new Promise( ( resolve, reject )=>{
        const payload = {
            uid
        }
        jwt.sign(payload, process.env.JWT_SECRET || "1234",{
            expiresIn:'12h'
        }, (err, token)=>{
            if(err){
                console.log(err)
                reject(err);
            }else{
                resolve(token);
            }
        }); 
    });  
} 
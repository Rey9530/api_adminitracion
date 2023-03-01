
import expres from 'express';
const  response = expres.response  ;
const  request = expres.request ;
import bcrypt from 'bcryptjs'; 

import { getenerarJWT } from '../helpers/jwt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()




export const login= async (req=request,resp=response)=>{

    const { usuario, password } = req.body;    
    try { 

        const usaurioDB = await prisma.usuarios.findFirst({
            where:{
                usuario
            }
        });  
        
        if(!usaurioDB){
            return resp.status(400).json({
                status:false,
                msg:'El usuario o clave son incorrectos',
                data:null
            });
        } 
        const validarPass = bcrypt.compareSync(password, usaurioDB.password);


        if(!validarPass){ 
            return resp.status(400).json({
                status:false,
                msg:'El email o clave no existe'
            });
        } 
        const token = await getenerarJWT(usaurioDB.id);


        resp.json({
            status:true,
            msg:"Logueado con exito",
            data:{ ...usaurioDB, token }, 
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            status:false,
            msg:'Error revise logs'
        });
    }
    return;
}
 

export const loginRenew= async (req=request,resp=response)=>{ 
    let uid:number = Number(req.params.uid); 
    const token = await getenerarJWT( uid );
    const usaurioDB = await prisma.usuarios.findFirst({
        where:{
            id:uid,
            estado:'ACTIVO'
        }
    });
    resp.json({
        status:true,
        msg: "Token renovado",
        data:{ ...usaurioDB,token }
    });
}

module.exports = {
    login,loginRenew
}
'user strict';

// const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

const execute = async () => {
    try {
 
        //SUCURSAL DEMO 
        let sucursal = await prisma.sucursales.create({
            data: { 
                nombre:"Sucursal Matriz"
            }
        }); 

        //ROLS DEMO 
        let rol = await prisma.roles.create({
            data: { 
                nombre:"Rol 1"
            }
        });

        //USUARIO DEMO
        const salt = bcrypt.genSaltSync();
        let password = bcrypt.hashSync("1234", salt);

        await prisma.usuarios.create({
            data: {
                nombres: "Usuario",
                apellidos:"Demo",
                usuario:"usuario",
                dui:"1234567890",
                password:password,
                id_rol:rol.id_rol,
                id_sucursal:sucursal.id_sucursal,
            }
        });
 
 
 
    } catch (err) {
        console.error(err);
        throw err;
    }
};

execute();

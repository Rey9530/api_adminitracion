
import expres from 'express';
const  response = expres.response  ;
const  request = expres.request ;
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import pathh from "path";   
import cloud from "cloudinary";
const cloudinary = cloud.v2;
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

 
export const borrarImage = (pathViejo:fs.PathLike)=>{  
    if(fs.existsSync(pathViejo)){
        fs.unlinkSync(pathViejo); 
    }
}  

export const subirArchivo = async (file:any) => {
  if (!file || Object.keys(file).length === 0) {
    return false;
  }

  const file_ = file.files;
  const nombreCortado = file_.name.split(".");
  const extencion = nombreCortado[nombreCortado.length - 1];

  let extencionesValidad = ["png", "jpg", "jpeg"];
  if (!extencionesValidad.includes(extencion)) {
    return "Extencion incorrecta";
  }
  const nombreArchivo = `${uuidv4()}.${extencion}`;
  const path = `./uploads/${nombreArchivo}`;

  return new Promise((resolve, _) => {
    file_.mv(path, function (err:any) {
      if (err) {
        console.log(err);
      } else {
        cloudinary.uploader.upload(path).then((result:any) => {
          borrarImage(path);
          resolve(result);
        });
      }
    });
  }).then((resp) => {
    // console.log(resp);
    return resp;
  });
};
 

export const eliminarArchivoCloudinary = (public_id:string) => {
  return new Promise((resolve, _) => {
    cloudinary.uploader.destroy(public_id).then((result:any) => { 
      resolve(result);
    });
  }).then((resp) => { 
    return resp;
  });
};
  

export const getArchivo = async (req = request, resp = response) => {
  const tipo = req.params.tipo;
  const img = req.params.img;
  const path = pathh.join(__dirname, `../uploads/${tipo}/${img}`);
  if (fs.existsSync(path)) {
    resp.sendFile(path);
  } else {
    const path = pathh.join(__dirname, `../uploads/no-img.jpg`);
    resp.sendFile(path);
  }
};
 
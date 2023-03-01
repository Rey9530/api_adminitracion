
import fs from 'fs';
export const borrarImage = (pathViejo:fs.PathLike)=>{  
    if(fs.existsSync(pathViejo)){
        fs.unlinkSync(pathViejo); 
    }
}  
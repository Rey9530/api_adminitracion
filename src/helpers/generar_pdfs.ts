
import puppeteer from "puppeteer"; 
import fs from "fs";
const FILE_PATH = __dirname + "/pdfs_x_borra/";
export const generarPdf = async (html: any, nombre: string = "reporte", isFile: boolean = false,isLandScape: boolean = false,) => {
    let browserOptions: any = {
        headless: 'old',
    }
    if (process.env.PORT != null && process.env.PORT != "4000") {
        browserOptions = {
            headless: 'old',
            executablePath: '/usr/bin/chromium-browser', 
            args: ['--no-sandbox']
        };
    }

    await eliminarArchivBasura();
    const browser = await puppeteer.launch(browserOptions);

    // Create a new page
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    //To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');
    const path = FILE_PATH + nombre + ".pdf";
    // Downlaod the PDF
    const pdf = await page.pdf({
        path,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
        printBackground: true,
        format: 'A4',
        landscape: isLandScape
    });
    await browser.close();

    if (pdf) {
        return isFile ? pdf : path;
    } else {
        return "";
    }
}
 
const eliminarArchivBasura = async () => {
    var files = fs.readdirSync(FILE_PATH);
    files.map((file: any) => {
        if (file != ".gitkeep") {
            const filePath = FILE_PATH + file;
            return fs.unlinkSync(filePath)
        }
    });
    fs.readdirSync(FILE_PATH)
}
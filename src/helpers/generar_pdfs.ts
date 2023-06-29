
import puppeteer from "puppeteer";
import fs from "fs";
const FILE_PATH = __dirname + "/pdfs_x_borra/";
export const generarPdf = async (html: any, nombre: string = "reporte", isFile: boolean = false) => {

    const browserOptions: any = {
        headless: 'old'
    };

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
        margin: { top: '50px', right: '40px', bottom: '30px', left: '40px' },
        printBackground: true,
        format: 'A4',
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
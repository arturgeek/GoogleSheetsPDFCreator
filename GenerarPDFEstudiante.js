function createStudentPDF () {
    //Plantilla Formato
    const templateDocFile = DriveApp.getFileById("1BcP7An6Alg_qvfJS83kzU0GNeP5N4qRMMIFGvaijZNg");
    //Directorio Para Archivos Temporales
    const tempFolder = DriveApp.getFolderById("1v9lLZTzgj98_PIbv_4AY9TUqXNTJSK5m");
    //Directorio Para PDFs Generados
    const pdfFolder = DriveApp.getFolderById("1wSrpaNWIZmgpE0OF09I1iWX4GJXX_IOY");
    //Hoja de Calculo del Formulario
    const currentSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
    
    //Obtener La Fila donde esta ubicado el usuario
    const currentRow = currentSheet.getCurrentCell().getRow();
    
    const data = currentSheet.getRange(
        currentRow, //Fila donde se encuentra el usuario
        2, //Columna desde donde se toman los datos
        1, //Cantidad de filas a tomar, en este caso solo la fila actual
        7 //Cantidad de columnas a avanzar
    ).getDisplayValues();
    
    const estudiante = {
        "sede": "",
        "primerApellido": "",
        "segundoApellido": "",
        "primerNombre": "",
        "segundoNombre": "",
        "RC": "",
        "NIP": "",
        "NUP": "",
        "CE": "",
        "CC": "",
        "numeroIdentifiacio": "",
    };
    
    let errors = [];
    data.forEach(row => {
        try{
            estudiante.sede = row[0];
            estudiante.primerApellido = row[1];
            estudiante.segundoApellido = row[2];
            estudiante.primerNombre = row[3];
            estudiante.segundoNombre = row[4];
            
            const tipoIdentificacion = row[5];
            estudiante[tipoIdentificacion] = "X";

            estudiante.numeroIdentifiacion = row[6];

            const nombreDocumentoPDF = `${estudiante.numeroIdentifiacion}_${estudiante.primerNombre}_${estudiante.segundoNombre}`;
            
            createPDF (estudiante , nombreDocumentoPDF, templateDocFile, tempFolder, pdfFolder);
            errors.push([""]);
        } catch(err) {
            errors.push(["Failed", err]);
        }
    }); //close for Each
    console.log(errors);
    //currentSheet.getRange (2, 5, currentSheet.getLastRow()-1,1).setValues(errors);
}

function createPDF (estudiante, pdfName, templateDocFile, tempFolder, pdfFolder) {
    
    const documentMap = {
        "sede": "a1",
        "primerApellido": "b1",
        "segundoApellido": "b2",
        "primerNombre": "b3",
        "segundoNombre": "b4",
        "RC": "c1",
        "NIP": "c2",
        "NUP": "c3",
        "CE": "c4",
        "CC": "c5",
        "numeroIdentifiacio": "c6",
    }
    
    const tempFile = templateDocFile.makeCopy(tempFolder);
    const tempDocFile = DocumentApp.openById(tempFile.getId());
    const body = tempDocFile.getBody();

    Object.keys(documentMap).forEach((key) => {
        const keyMap = documentMap[key];
        body.replaceText(`{${keyMap}}`, estudiante[key]);
    });

    tempDocFile.saveAndClose();
    const pdfContentBlob = tempFile.getAs (MimeType.PDF);
    pdfFolder.createFile(pdfContentBlob).setName(pdfName);
    tempFolder.removeFile(tempFile);
} 
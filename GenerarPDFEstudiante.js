function createStudentPDF () {
    //Plantilla Formato
    //const templateDocFile = DriveApp.getFileById("1BcP7An6Alg_qvfJS83kzU0GNeP5N4qRMMIFGvaijZNg");
    const templateSlidesFile = DriveApp.getFileById("1hJNP5mu3qlnh2LtUbznmcUc_RApSWUZ61xPzzMLcNSg");
    //Directorio Para Archivos Temporales
    const tempFolder = DriveApp.getFolderById("1v9lLZTzgj98_PIbv_4AY9TUqXNTJSK5m");
    //Hoja de Calculo del Formulario
    const currentSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
    
    //Create a Copy of the Slides File in the Temp Folder
    const newSlideFile = templateSlidesFile.makeCopy(tempFolder);
    //Open de tempFile using the Slides API to use
    const templateDocFile = SlidesApp.openById(newSlideFile.getId());
    //Obtener el primer Slide del nuevo archivo de Slides
    const templateSlide = templateDocFile.getSlides()[0];
    
    //Obtener La Fila donde esta ubicado el usuario
    const currentRow = currentSheet.getCurrentCell().getRow();
    const mapColumnsCount = currentSheet.getLastColumn() - 1;
  
    const documentMap = getSheetDocumentMap(currentSheet, mapColumnsCount)
    const data = getData(currentSheet, currentRow, mapColumnsCount);
  
    const estudiante = {};
    documentMap.forEach((mapValue, index) => {
      let value = data[index]
  
      if(value.indexOf("-") > 0){
        value = value.split("-")[1].replace(/_/g, ' '.repeat(7));
      }
  
      if(value.indexOf("/") > 0){
        value = value.split("/").join(' '.repeat(7));
      }
  
      estudiante[mapValue] = value;
    });
  
    const pdfName = getResultantDocumentName(data);
    newSlideFile.setName(pdfName);
  
    let errors = [];
    try{
      const templateSlideElements = templateSlide.getPageElements();
      templateSlideElements.forEach((element, index) => {
        const elementShape = element.asShape(); 
        const documentKey = elementShape.getText().asString().replace("\n", "");
        if (estudiante.hasOwnProperty(documentKey)) {
          elementShape.getText().setText(estudiante[documentKey]);
        }
      })
    }
    catch(err) {
      errors.push(err);
    }
  
    if(errors.length === 0){
      console.log("Save document", pdfName);
      templateDocFile.saveAndClose();
      createPdfFromTempFile(newSlideFile, pdfName);
    }
    else {
      console.error("Error", errors);
    }
  
    tempFolder.removeFile(newSlideFile);
  }
  
  function getSheetDocumentMap(currentSheet, mapColumnsCount){
    return currentSheet.getRange(
      2, //Fila donde se encuentra el mapa de valores
      2, //Columna desde donde se toman los datos
      1, //Cantidad de filas a tomar, en este caso solo la fila actual
      mapColumnsCount //Cantidad de columnas a avanzar
    ).getDisplayValues()[0];
  }
  
  function getData(currentSheet, currentRow, mapColumnsCount) {
    return currentSheet.getRange(
        currentRow, //Fila donde se encuentra el usuario
        2, //Columna desde donde se toman los datos
        1, //Cantidad de filas a tomar, en este caso solo la fila actual
        mapColumnsCount //Cantidad de columnas a avanzar
    ).getDisplayValues()[0];
  }
  
  function getResultantDocumentName(data) {
    const nameIndex = [12,7,8,9,10];
    let documentName = [];
    nameIndex.forEach((indexNameValue, index) => {
      documentName.push(data[indexNameValue]);
      if(index === 0){
        documentName.push("_");
      }
    });
    return documentName.join("");
  }
  
  function createPdfFromTempFile(tempFile, pdfName) {
    //Directorio Para PDFs Generados
    const pdfFolder = DriveApp.getFolderById("1wSrpaNWIZmgpE0OF09I1iWX4GJXX_IOY");
  
    const pdfContentBlob = tempFile.getAs (MimeType.PDF);
    pdfFolder.createFile(pdfContentBlob).setName(pdfName);
  }
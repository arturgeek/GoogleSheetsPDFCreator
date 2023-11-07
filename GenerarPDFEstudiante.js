function createBulkPDFs () {
	const docFile = DriveApp.getFileById("17m09Ey5vg07oYsNXa4FwuPd9Bn4-kjSndXbvK9NWvsM");
	const tempFolder = DriveApp.getFolderById("14WgBfLtVriJWqyPwMtDYqJg-gmAkqBIj");
	const pdfFolder = DriveApp.getFolderById("1-VWpj4bQi1uX9-CEspH_t8QPqWW4dCt1");
	const currentSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("people");
	const data = currentSheet.getRange (2, 1, currentSheet.getLastRow()-1,4).getDisplayValues();
	let errors = [];
	data.forEach(row => {
	try{
	createPDF (row[0], row[1], row[3], row[0] + " " + row[1], docFile, tempFolder, pdfFolder);
	errors.push([""]);
	} catch(err) {
	errors.push(["Failed"]);
	}
	}); //close for Each
	currentSheet.getRange (2, 5, currentSheet.getLastRow()-1,1).setValues(errors);

}


function createPDF (firstName, lastName, amount, pdfName, docFile, tempFolder, pdfFolder) {
	const tempFile = docFile.makeCopy(tempFolder);
	const tempDocFile = DocumentApp.openById(tempFile.getId());
	const body = tempDocFile.getBody();
	body.replaceText("{first}", firstName);
	body.replaceText("{last)", lastName);
	body.replaceText(" (balance)", amount);
	tempDocFile.saveAndClose();
	const pdfContentBlob = tempFile.getAs (MimeType.PDF);
	pdfFolder.createFile(pdfContentBlob).setName(pdfName);
	tempFolder.removeFile(tempFile);
} 
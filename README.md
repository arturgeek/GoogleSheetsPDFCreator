# GoogleSheetsPDFCreator
This script should be implemented in apps-script to create a single PDF file from the current focused cell's row in a Google Sheet's1 sheet.

### Why was this script created

From a Google Form that fills out the information of students onto a Google Sheet, it was required to build a PDF with a specific format On-Demand

### Requirements

1. A Google Sheet with the necessary information to Fill the PDF
2. A template created in Google Docs to fill in the information
3. A folder to create the temporary PDF documents
4. A folder to store each newly created PDF 

### To Implement
1. The script should be added from the **Extensions** -> **Apps Scripts** menu
2. Add the code to the script and add a proper name
3. Update these values on the script, the IDs are the values that you can extract from the URL while navigating Drive

- **templateDocFile:** The ID of the Google Docs template document
- **tempFolder:** The ID of the folder to store the temporary files
- **pdfFolder:** The ID of the folder to store the permanent PDF files

4. Modify, Test, and Debug as you need
5. Use this guide https://developers.google.com/apps-script/guides/sheets/macros?hl=es-419

- Add the function as a macro to the sheet.
- Create a command using **CTRL** + **ALT** + **SHIFT** + **_NUMBER_** **(CTRL+ALT+SHIFT+0)** to run the script on the currently selected cells' row
   
6. Enjoy

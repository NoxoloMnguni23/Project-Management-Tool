import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  

  downloadSpreadsheet(spreadSheetName: any,spreadSheetData: any): void {
    const fileName = `${spreadSheetName}.xlsx`;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(spreadSheetData);
    console.log('workbook',wb)
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // save
    XLSX.writeFile(wb, fileName,)
  }

  constructor() { }
}

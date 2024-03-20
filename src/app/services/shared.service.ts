import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  usersUpdated: boolean = false;
  usersUpdatedSubject = new Subject<any>();
  projectsUpdated: boolean = false;
  projectsUpdatedSubject = new Subject<any>();
  noTasks: boolean = false;
  noTasksSubject = new Subject<any>();

  updateUsersWatch(): void {
    this.usersUpdated = true;
    this.usersUpdatedSubject.next(this.usersUpdated);
  }

  watchUsersUpdate(): Observable<any> {
    return this.usersUpdatedSubject.asObservable();
  }

  updateNoTasksWatch(): void {
    this.noTasks = true;
    this.noTasksSubject.next(this.noTasks);
  }

  watchNoTasksUpdate(): Observable<any> {
    return this.noTasksSubject.asObservable();
  }

  updateProjectsWatch(): void {
    this.projectsUpdated = true;
    this.projectsUpdatedSubject.next(this.usersUpdated);
  }

  watchProjectsUpdate(): Observable<any> {
    return this.projectsUpdatedSubject.asObservable();
  }

  get(key: string, sessionType: string): any {
    let data = sessionType === 'session' ? sessionStorage.getItem(key) : localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  store(value: any, key: string, sessionType: string): void {
    sessionType === 'session' ? sessionStorage.setItem(key, JSON.stringify(value)) : localStorage.setItem(key, JSON.stringify(value));
    console.log('User stored')
  }


  downloadSpreadsheet(spreadSheetName: any, spreadSheetData: any): void {
    const fileName = `${spreadSheetName}.xlsx`;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(spreadSheetData);
    console.log('workbook', wb)
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // save
    XLSX.writeFile(wb, fileName,)
  }

  constructor() { }
}

import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddUserFormComponent } from '../add-user-form/add-user-form.component';
import *as XLSX from 'xlsx';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  constructor(public dialog: MatDialog) {}

  openDialog(){this.dialog.open(AddUserFormComponent)}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      const arrayBuffer = e.target.result;
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
      console.log(jsonData);

    };

    fileReader.readAsArrayBuffer(file);
  }
  // constructor(private apiUserService : ApiService){}
  // role : any ; 

  // displayedColumns: string[] = ['firstName', 'lastName','gender', 'id','email','role','password'];
  // dataSource = this.apiUserService.getUsers(Users);

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

}

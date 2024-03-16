import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserFormComponent } from '../add-user-form/add-user-form.component';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  users: any = [];


  userTable: any;

  constructor(public dialog: MatDialog, private api: ApiService, private snackBar: MatSnackBar) { 
    this.userTable =
    {
      title: 'Users',
      dataSource: this.api.genericGet('/get-users'),
      displayedColumns: ['firstName', 'lastName', 'gender', 'id', 'email', 'role'],
      displayedHeaders: ['First Name', 'Last Name', 'Gender', 'ID', 'Email', 'Role']
    }
  }
  
  // add user form
  openDialog() { 
    this.dialog.open(AddUserFormComponent);
  }

  // add user via excel spreadsheet
  onFileChange(event: any): void {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      const arrayBuffer = e.target.result;
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
      this.users = jsonData;
      console.log("file data", this.users);
      // Add password field for every user
      this.users.forEach((fileUser: any,indx: any) => {
        this.users[indx]['password'] = 'test123';
      })
      console.log("file data users with passwords", this.users);
      this.api.genericGet('/get-users').subscribe({
        next: (res: any) => {
          this.users.forEach((fileUser: any) => {
            let userExists = false;
            res.forEach((user: any) => {
              if (fileUser.id === user.id) {
                console.log('User already exists:', fileUser.id);
                userExists = true;
                return;
              }
            });
            if (!userExists) {
              console.log('Adding user:', fileUser.id);
              this.addUserApi(fileUser);
            }
          });
        },
        error: (err) => {
          console.error('Error fetching users:', err);
        },
        complete: () => {
          console.log('Completed fetching users.');
        }
      });
    };
    fileReader.readAsArrayBuffer(file);
  }

  addUserApi(fileUserToStore: any) {
    this.api.genericPost('/add-user', fileUserToStore).subscribe({
      next: (res) => {
        this.snackBar.open('File uploaded successfully','Ok',{duration: 3000});
      },
      error: (err) => {
        console.error('Error adding user:', err);
      },
      complete: () => {
        console.log('Completed adding user.');
      }
    });
  }
  
}


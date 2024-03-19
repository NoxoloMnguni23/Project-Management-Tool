import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserFormComponent } from '../add-user-form/add-user-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  users: any = [];


  userTable: any;

  constructor(public dialog: MatDialog, private api: ApiService, private snackBar: MatSnackBar,
    private sharedService: SharedService) {
    this.userTable =
    {
      title: 'Users',
      dataSource: this.api.genericGet('/get-users'),
      displayedColumns: ['firstName', 'lastName', 'gender', 'id', 'email', 'role', 'action'],
      displayedHeaders: ['First Name', 'Last Name', 'Gender', 'ID', 'Email', 'Role', 'Action']
    }
  }
}




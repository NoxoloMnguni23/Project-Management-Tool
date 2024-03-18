import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  approvedSchedule: any;
  projects: any;
  users: any;
  user: any;



  constructor(private userService: SharedService, private dialog: MatDialog) {
    this.projects =

      this.user = sessionStorage.getItem('currentUser')
     this.user = JSON.parse(this.user)

    this.approvedSchedule = this.userService.get('approvedSchedule', 'local')


    if (this.user.role === 'admin' || this.user.role === "manager" || this.user.role === "employee") {
      this.projects
    } else {

    }

  }


}

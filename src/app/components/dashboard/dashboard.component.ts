import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  user: any;
  projects:any;
  noOfUsers:any;  

  constructor( private userService: UserInfoService, private dialog:MatDialog ){
    this.user = sessionStorage.getItem('currentUser')
    this.user = JSON.parse(this.user)
    
  }
}

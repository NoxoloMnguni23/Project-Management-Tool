// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-team-members',
//   templateUrl: './team-members.component.html',
//   styleUrls: ['./team-members.component.scss']
// })
// export class TeamMembersComponent {

// }

import { AfterViewInit, Component, Inject } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent  {
  user: any;
  teamMembers: any = []
  teamMemberData: any = 
  {
    title: 'Team Members',
    dataSource: [],
    displayedColumns: ['firstName', 'lastName', 'gender', 'id', 'email', 'role'],
    displayedHeaders: ['First Name', 'Last Name', 'Gender', 'ID', 'Email', 'Role']
    
  };
  dataSource!: MatTableDataSource<any>;
  
  constructor(private api: ApiService, @Inject(MAT_DIALOG_DATA) private _data: any) {
  }
}

import { AfterViewInit, Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent  {

  user: any;
  teamMembers: any = {
    title: 'Users',
    dataSource: [],
    displayedColumns: ['firstName', 'lastName', 'gender', 'id', 'email', 'role'],
    displayedHeaders: ['First Name', 'Last Name', 'Gender', 'ID', 'Email', 'Role']
  }

  teamMemberData: any;
  dataSource!: MatTableDataSource<any>;

 
  
  constructor(private api: ApiService) {
    this.api.genericGet('/get-users').subscribe({
      next: (res: any) => {
        console.log("res",res);
        this.teamMemberData = res.filter((user: any) => user.role === 'team member');
        console.log("teamMemberData", this.teamMemberData)
        this.teamMemberFunction();
      }
    })
    
  }
  teamMemberFunction(){
    this.teamMembers =
    {
      title: 'Users',
      dataSource: this.teamMemberData,
      displayedColumns: ['firstName', 'lastName', 'gender', 'id', 'email', 'role'],
      displayedHeaders: ['First Name', 'Last Name', 'Gender', 'ID', 'Email', 'Role']
    }
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
}

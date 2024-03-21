import { AfterViewInit, Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent implements AfterViewInit {

  user: any;
  teamMembers: any = {
    title: 'Users',
    dataSource: [],
    displayedColumns: ['firstName', 'lastName', 'gender', 'id', 'email', 'role'],
    displayedHeaders: ['First Name', 'Last Name', 'Gender', 'ID', 'Email', 'Role']
  }

  teamMemberData: any;

  ngAfterViewInit(): void {
   
  }
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
    this.teamMembers.dataSource = this.teamMemberData;
  }


}

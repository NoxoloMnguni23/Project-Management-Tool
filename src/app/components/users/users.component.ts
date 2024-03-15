import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {



  openDialog(){}
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

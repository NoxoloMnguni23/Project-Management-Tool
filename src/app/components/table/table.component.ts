import { AfterViewInit, Component, ViewChild, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddUserFormComponent } from '../add-user-form/add-user-form.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges {

  @Input() tableData: any;
  users: any;
  isAdmin: boolean = false;
  isTeamMember: boolean = false;
  displayedColumns: string[] = [];
  displayedHeaders: string[] = [];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private dialog: MatDialog,
    private sharedService: SharedService) {
    this.sharedService.watchUsersUpdate().subscribe((usersUpdated: boolean) => {
      this.apiService.genericGet('/get-users').subscribe((res: any) => {
        this.dataSource = res;
      });
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.tableData.title === 'Users') {
      this.isAdmin = true;
      // Fetch user data from API
      this.refreshUsers()
    } else if (this.tableData.title === 'Tasks') {
      this.isAdmin = false;
      this.apiService.genericGet('/get-tasks').subscribe((res: any) => {
        console.log("res tasks", res)
        this.dataSource = new MatTableDataSource<any>(res);
      });
      // Fetch tasks data from API
      this.refreshTasks();
    }
    if (changes['tableData']) {
      this.dataSource = new MatTableDataSource(this.tableData.dataSource);
      this.displayedColumns = this.tableData.displayedColumns
      this.displayedHeaders = this.tableData.displayedHeaders
    }

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // On input focus: setup filterPredicate to only filter by input column
  setupFilter() {
    const columnArr = ['taskTitle', 'taskPriority', 'status', 'taskDeadline'];
    this.dataSource.filterPredicate = (data: any, filter: any) => {
      const lowercaseFilter = filter.toLowerCase();
      return columnArr.some(column => {
        const textToSearch = data[column] && data[column].toLowerCase() || '';
        return textToSearch.includes(lowercaseFilter);
      });
    };
  }

  deleteRow(row: any) {
    const confirmDelete = prompt('type delete to confirm');
    if (confirmDelete?.toLowerCase() === 'delete') {
      // If delete confirmed
      if (this.tableData.title === 'Users') {
        this.apiService.genericDelete(`/delete-user/${row.email}`)
          .subscribe({
            next: (res) => {
              console.log("row parsed", res)
              // Fetch user data from API
              this.refreshUsers()
              this.snackBar.open('User deleted successfully', 'Ok', { duration: 3000 });
            },
            error: (res) => {
              this.snackBar.open('Error deleting user', 'Ok', { duration: 3000 });
            },
            complete: () => { }
          })
      } else {
        // To edit for task
        // this.apiService.genericDelete(`/delete-user/${row.email}`)
        //   .subscribe({
        //     next: (res) => {
        //       console.log("row parsed", res)
        //       // Fetch user data from API
        //       this.refreshUsers()
        //       this.snackBar.open('User deleted successfully', 'Ok', { duration: 3000 });
        //     },
        //     error: (res) => {
        //       this.snackBar.open('Error deleting user', 'Ok', { duration: 3000 });
        //     },
        //     complete: () => { }
        //   })
      }

    } else {
      this.snackBar.open('Action cancelled', 'Ok', { duration: 3000 })
    }
  }
  editRow(row: any) {
    this.dialog.open(AddUserFormComponent, { data: row });
    console.log("row", row)
  }

  refreshUsers(): void {
    // Fetch user data from API
    this.apiService.genericGet('/get-users').subscribe((res: any) => {
      this.dataSource = res;
    });
  }

  refreshTasks(): void {
    this.apiService.genericGet('/get-tasks').subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<any>(res);
    });
  }
}

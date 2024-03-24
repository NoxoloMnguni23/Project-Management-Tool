import { AfterViewInit, Component, ViewChild, Input, OnChanges, SimpleChanges, OnInit, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddUserFormComponent } from '../add-user-form/add-user-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
import { AddTaskComponent } from '../forms/add-task/add-task.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges, OnInit {

  @Input() tableData: any;


  users: any;
  isAdmin: boolean = false;
  isTeamMember: boolean = false;
  displayedColumns: string[] = [];
  displayedHeaders: string[] = [];
  dataSource!: MatTableDataSource<any>;
  spinnerElement: any;
  tableDataAvailable: any;
  canEditTask: boolean = false;
  taskStatuses: string[] = ['In-Progress', 'Completed'];
  currentUser: any;
  foundUser: any;
  usersTableDataOnly: boolean = false;



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
      this.users.forEach((fileUser: any, indx: any) => {
        this.users[indx]['password'] = 'test123';
      })
      console.log("file data users with passwords", this.users);
      this.api.genericGet('/get-users').subscribe({
        next: async (res: any) => {
          this.users.forEach((fileUser: any, indx: any) => {
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
              this.progressSpinner('show')
              this.sharedService.updateUsersWatch();
              // Update users table
              this.sendEmailApi(fileUser);
              // this.apiService.genericGet('/get-users').subscribe((res: any) => {
              //   this.progressSpinner('hide');
              //   res = res.filter((user: any) => user.role.toLowerCase() !== 'admin');
              //   this.dataSource = new MatTableDataSource<any>(res);
              //   this.tableDataAvailable = 'Users';
              // });
              this.snackBar.open('File uploaded successfully', 'Ok', { duration: 3000 });
            }
          });
        },
        error: (err) => {
          console.error('Error fetching users:', err);
        },
        complete: () => {
        }
      });
    };
    fileReader.readAsArrayBuffer(file);
  }

  addUserApi(fileUserToStore: any) {
    console.log("fileUserToStore", fileUserToStore)
    this.api.genericPost('/add-user', fileUserToStore).subscribe({
      next: (res) => {
        const sendPoints = {
          "subject": "Account Created",
          "firstName": fileUserToStore.firstName,
          "email": fileUserToStore.email
        }
        this.apiService.genericPost('/forgotPassword', sendPoints)
          .subscribe({
            next: (res) => { console.log(res) },
            error: (err) => { console.log(err) },
            complete: () => { }
          })
      },
      error: (err) => {
        console.error('Error adding user:', err);
      },
      complete: () => {
        console.log('Completed adding user.');
      }
    });
  }

  sendEmailApi(email: any) {
    this.api.genericPost('/sendPassword', email)
      .subscribe({
        next: (res) => { console.log(res) },
        error: (err) => { console.log(err) },
        complete: () => { }
      })
  }

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private dialog: MatDialog,
    private sharedService: SharedService, private snackbar: MatSnackBar, private api: ApiService,
    private dialogRef: MatDialogRef<TableComponent>) {
    this.currentUser = this.sharedService.get('currentUser', 'session');
    console.log("currentUser", this.currentUser)
    if (this.currentUser.role === 'team member') {
      this.canEditTask = true;
    }
    this.sharedService.watchUsersUpdate().subscribe((usersUpdated: boolean) => {
      this.apiService.genericGet('/get-users').subscribe((res: any) => {
        this.progressSpinner('hide');
        res = res.filter((user: any) => user.role.toLowerCase() !== 'admin');
        this.dataSource = new MatTableDataSource<any>(res);
        this.tableDataAvailable = 'Users';
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
      if (this.currentUser.role === 'team member') {
        this.apiService.genericGet('/assigned-tasks').subscribe((res: any) => {
          this.foundUser = res.filter((assignedTask: any) => assignedTask.teamMember._id === this.currentUser._id)
          // One task per user
          let tableData = []
          tableData.push(this.foundUser[0].task)
          this.dataSource = new MatTableDataSource<any>(tableData);
        });
      } else {
        this.apiService.genericGet('/get-tasks').subscribe((res: any) => {
          this.dataSource = new MatTableDataSource<any>(res);
        });
      }
      this.tableDataAvailable = 'Tasks';
    } else if (this.tableData.title === 'Team Members') {
      // Fetch user data from API
      this.apiService.genericGet('/get-users').subscribe((res: any) => {
        res = res.filter((user: any) => user.role.toLowerCase() === 'team member');
        this.dataSource = new MatTableDataSource<any>(res)
        if (res.length !== 0) {
          this.tableDataAvailable = true;
        }
      })
    }
    if (changes['tableData']) {
      this.dataSource = new MatTableDataSource(this.tableData.dataSource);
      this.displayedColumns = this.tableData.displayedColumns
      this.displayedHeaders = this.tableData.displayedHeaders
    }

  }

  ngOnInit(): void {
    this.spinnerElement = document.getElementById('spinner') as HTMLElement | undefined;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteRow(row: any) {
    const confirmDelete = prompt('type delete to confirm');
    if (confirmDelete?.toLowerCase() === 'delete') {
      this.progressSpinner('show');
      // If delete confirmed
      if (this.tableData.title === 'Users') {
        this.apiService.genericDelete(`/delete-user/${row.email}`)
          .subscribe({
            next: (res) => {
              this.progressSpinner('hide');
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
        this.apiService.genericDelete(`/delete-task/${row._id}`)
          .subscribe({
            next: (res) => {
              this.snackBar.open('Task deleted successfully', 'Ok', { duration: 3000 });
              // Close dialog
              this.apiService.genericGet('/get-tasks').subscribe((res: any) => {
                if (res.length === 0) {
                  this.dialogRef.close();
                }
                this.progressSpinner('hide');
                this.sharedService.updateNoTasksWatch();
                this.dataSource = new MatTableDataSource<any>(res);
              });
            },
            error: (res) => {
              this.snackBar.open('Error deleting task', 'Ok', { duration: 3000 });
            },
            complete: () => { }
          })
      }

    } else {
      this.snackBar.open('Action cancelled', 'Ok', { duration: 3000 })
    }
  }
  editRow(row: any) {
    if (this.tableData.title === 'Users') {
      this.dialog.open(AddUserFormComponent, { data: row });
    } else {
      this.dialog.open(AddTaskComponent, { data: row })
    }
  }

  refreshUsers(): void {
    // Fetch user data from API
    this.apiService.genericGet('/get-users').subscribe((res: any) => {
      res = res.filter((user: any) => user.role.toLowerCase() !== 'admin');
      this.dataSource = new MatTableDataSource<any>(res)
      if (res.length !== 0) {
        this.tableDataAvailable = true;
      }
    });
  }

  progressSpinner(action: any) {
    switch (action) {
      case 'show':
        this.spinnerElement.classList.remove('hide');
        break;
      case 'hide':
        this.spinnerElement.classList.add('hide');
        break;
      default:
        break;
    }
  }

  changeStatus(taskStatus: any) {
    this.foundUser[0].task.status = taskStatus;
    this.api.genericPost('/update-assigned-task', this.foundUser[0]).subscribe((res: any) => {
      console.log(res);
    })
    console.log(this.foundUser[0].task)
    this.api.genericPost('/update-task', this.foundUser[0].task).subscribe((res: any) => {
      console.log("update res", res);
    })
  }
  refreshTasks(): void {
    this.apiService.genericGet('/get-tasks').subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<any>(res);
    });
  }
}

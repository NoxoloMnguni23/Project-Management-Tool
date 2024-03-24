import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  tableData: any;
  currentUser: any;
  constructor(private api: ApiService, private snackbar: MatSnackBar, private sharedService: SharedService,
    private dialogRef: MatDialogRef<TasksComponent>) {
    this.currentUser = this.sharedService.get('currentUser','session');
    if(this.currentUser.role === 'team member') {
      this.tableData = {
        title: 'Tasks',
        displayedColumns: ['taskTitle', 'taskPriority', 'taskDeadline', 'status'],
        displayedHeaders: ['Title', 'Priority', 'Deadline', 'Status']
      }
    } else {
      this.tableData = {
        title: 'Tasks',
        displayedColumns: ['taskTitle', 'taskPriority', 'taskDeadline', 'status','action'],
        displayedHeaders: ['Title', 'Priority', 'Deadline', 'Status','Actions']
      }

    }
    this.sharedService.watchNoTasksUpdate().subscribe((isNoTasks: any) => { console.log('tasks updated') })
  }

  downloadSpreadsheet(): void {
    // Get all tasks
    this.api.genericGet('/get-tasks')
      .subscribe({
        next: (res: any) => {
          this.sharedService.downloadSpreadsheet('Project-Tasks-Spreadsheet', res);
        },
        error: (err) => console.log(err),
        complete: () => { }
      })
    console.log('downloading')
    let  docDefination={
      
    }
  }

  close() {
    this.dialogRef.close();
  }

 }

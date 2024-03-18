import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  tableData: any;
  constructor(private api: ApiService, private snackbar: MatSnackBar, 
    private dialogRef: MatDialogRef<TasksComponent>, private sharedService: SharedService) {
    this.tableData = {
      title: 'Tasks',
      displayedColumns: ['taskTitle', 'taskPriority', 'taskDeadline', 'status'],
      displayedHeaders: ['Title', 'Priority', 'Deadline', 'Status']
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  downloadSpreadsheet(): void {

    // Get all tasks
    this.api.genericGet('/get-tasks')
      .subscribe({
        next: (res: any) => {
          this.sharedService.downloadSpreadsheet('Project-Tasks-Spreadsheet',res);
        },
        error: (err) => console.log(err),
        complete: () => { }
      })
    console.log('downloading')
  }
}

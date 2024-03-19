import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    private dialogRef: MatDialogRef<TasksComponent>, private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) private data: any) {
    this.tableData = {
      title: 'Tasks',
      displayedColumns: ['taskTitle', 'taskPriority', 'taskDeadline', 'status', 'action'],
      displayedHeaders: ['Title', 'Priority', 'Deadline', 'Status', 'Actions']
    }
    this.sharedService.watchNoTasksUpdate().subscribe((isNoTasks: any) => this.close())
  }

  close(): void {
    this.dialogRef.close();
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
  }
}

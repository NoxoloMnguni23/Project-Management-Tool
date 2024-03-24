import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  openProject: any;
  openTask: any;
  taskFormGroup: FormGroup;
  onEditTask: boolean = false;
  priorities: string[] = ['Top','Medium','Average','Less'];
  projectDetails: any;

  constructor(private dialogRef: MatDialogRef<AddTaskComponent>, private api: ApiService,
    @Inject(MAT_DIALOG_DATA) private row: any, private snackbar: MatSnackBar,
    private sharedService: SharedService) {
    this.projectDetails = row;
    if (row.taskDeadline) {
      console.log("row edit", row)
      this.onEditTask = true;
      this.openTask = row;
      this.taskFormGroup = new FormGroup({
        project: new FormControl(row.project, [Validators.required]),
        taskTitle: new FormControl(row.taskTitle, [Validators.required]),
        taskDescription: new FormControl(row.taskDescription, [Validators.required]),
        taskPriority: new FormControl(row.taskPriority, [Validators.required]),
        taskDeadline: new FormControl(row.taskDeadline, [Validators.required]),
        status: new FormControl(row.status, [Validators.required]),
      })
    } else {
      this.taskFormGroup = new FormGroup({
        project: new FormControl(row._id, [Validators.required]),
        taskTitle: new FormControl('', [Validators.required]),
        taskDescription: new FormControl('', [Validators.required]),
        taskPriority: new FormControl('', [Validators.required]),
        taskDeadline: new FormControl('', [Validators.required]),
        status: new FormControl('Pending', [Validators.required]),
      })
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if(this.taskFormGroup.invalid) return;
    if (this.onEditTask) {
      const { taskDeadline, status, taskPriority, taskDescription, taskTitle } = this.taskFormGroup.value;
      this.openTask.taskDeadline = taskDeadline;
      this.openTask.status = status;
      this.openTask.taskPriority = taskPriority;
      this.openTask.taskDescription = taskDescription;
      this.openTask.taskTitle = taskTitle;
      this.api.genericPost('/update-task', this.openTask)
        .subscribe({
          next: (res) => {
            console.log("res", res)
            this.snackbar.open('Task updated succesfully', 'OK', { duration: 3000 });
            this.dialogRef.close();
          },
          error: (err) => console.log(err),
          complete: () => { }
        })
    } else {
      console.log('About to add task', this.taskFormGroup.value);
      this.api.genericPost('/add-task', this.taskFormGroup.value)
        .subscribe({
          next: (res) => {
            console.log("res", res)
            this.snackbar.open('Task added succesfully', 'OK', { duration: 3000 });
            this.sharedService.updateNoTasksWatch();
            this.dialogRef.close();
          },
          error: (err) => console.log(err),
          complete: () => { }
        })
    }
  }
}

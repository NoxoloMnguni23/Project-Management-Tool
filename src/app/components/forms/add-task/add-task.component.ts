import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  openProject: any;
  taskFormGroup: FormGroup;
  onEditTask: boolean = false;
  priorities: any[] = [];

  constructor(private dialogRef: MatDialogRef<AddTaskComponent>, private api: ApiService,
     @Inject(MAT_DIALOG_DATA) private _project: any, private snackbar: MatSnackBar) {
    this.openProject = _project._project;

    // Get all tasks
    this.api.genericGet('/get-tasks')
    .subscribe({
      next: (res: any) => {
        // Create priority using existing task
        res.forEach((task: any, indx: any) => {
          this.priorities.push(indx + 1);
        })
        if(res.length === 0) {
          this.priorities.push(1);
        }
      },
      error: (err) => console.log(err),
      complete: () => { }
    })
    
    this.taskFormGroup = new FormGroup({
      project: new FormControl(this.openProject._id, [Validators.required]),
      taskTitle: new FormControl('', [Validators.required]),
      taskDescription: new FormControl('', [Validators.required]),
      taskPriority: new FormControl('', [Validators.required]),
      taskDeadline: new FormControl('', [Validators.required]),
      status: new FormControl('Pending', [Validators.required]),
    })
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.api.genericPost('/add-task', this.taskFormGroup.value)
      .subscribe({
        next: (res) => {
          console.log("res", res)
          this.snackbar.open('Task added succesfully', 'OK', { duration: 3000 });
          this.dialogRef.close();
        },
        error: (err) => console.log(err),
        complete: () => { }
      })
  }
}

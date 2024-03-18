import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})

export class AddProjectComponent {
  projectFormGroup: FormGroup;
  onEditProject: boolean = false;
  toppings = new FormControl('');
  usersList!: any;


  constructor(private dialogRef: MatDialogRef<AddProjectComponent>,
    private api: ApiService, private snackbar: MatSnackBar, @Inject(MAT_DIALOG_DATA) private _project: any) {

    this.api.genericGet('/get-users')
      .subscribe({
        next: (res) => {
          console.log("res", res)
          this.usersList = res;
        },
        error: (err) => console.log(err),
        complete: () => { }
      })

    if (_project) {
      const projectToEdit = _project._project;
      this.onEditProject = true;
      console.log("projectToEdit", projectToEdit)
      this.projectFormGroup = new FormGroup({
        projectName: new FormControl(projectToEdit.projectName, [Validators.required]),
        projectManager: new FormControl(projectToEdit.projectManager, [Validators.required]),
        projectDescription: new FormControl(projectToEdit.projectDescription, [Validators.required]),
        startDate: new FormControl(projectToEdit.startDate, [Validators.required]),
        endDate: new FormControl(projectToEdit.endDate, [Validators.required]),
        teamMembers: new FormControl(projectToEdit.teamMembers, [Validators.required]),
        status: new FormControl(projectToEdit.status, [Validators.required]),
      })
      return;
    }
    this.projectFormGroup = new FormGroup({
      projectName: new FormControl('', [Validators.required]),
      projectManager: new FormControl('', [Validators.required]),
      projectDescription: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      teamMembers: new FormControl('', [Validators.required]),
      status: new FormControl('Pending', [Validators.required]),
    })
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this._project) {
      this.api.genericPost('/update-project', this.projectFormGroup.value)
        .subscribe({
          next: (res) => {
            console.log("res", res)
            this.snackbar.open('Project updated succesfully', 'OK', { duration: 3000 });
            this.dialogRef.close();
          },
          error: (err) => console.log(err),
          complete: () => { }
        })
      return;
    }
    if (this.projectFormGroup.invalid) return;
    this.api.genericPost('/add-project', this.projectFormGroup.value)
      .subscribe({
        next: (res) => {
          console.log("res", res)
          this.snackbar.open('Project added succesfully', 'OK', { duration: 3000 });
          this.dialogRef.close();
        },
        error: (err) => console.log(err),
        complete: () => { }
      })
  }
}

import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})

export class AddProjectComponent {
  projectFormGroup: FormGroup;

  constructor(private dialogRef: MatDialogRef<AddProjectComponent>) {
    this.projectFormGroup = new FormGroup({
      projectName: new FormControl('', [Validators.required]),
      projectManager: new FormControl('', [Validators.required]),
      projectDescription: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      teamMembers: new FormControl('', [Validators.required]),
    })
  }

  toppings = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.projectFormGroup.invalid) return;
    console.log("this.projectFormGroup values", this.projectFormGroup.value)
  }
}

import { Component, Inject, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.scss']
})
export class AddUserFormComponent {
  roles: string[] = ['team member']
  genders: string[] = ['male', 'female']
  isEditting: boolean = false;
  users: any = [];
  gender : any;

  addUser: FormGroup;



  constructor(private dialogRef: MatDialogRef<AddUserFormComponent>, private sharedService: SharedService,
    private api: ApiService, private snackbar: MatSnackBar, @Inject(MAT_DIALOG_DATA) private data: any) {
    console.log("sharedData", data)
    if (data) {
      this.isEditting = true;
      // If we are opening with dialog do something
      this.addUser = new FormGroup({
        firstName: new FormControl(data.firstName, [Validators.required]),
        lastName: new FormControl(data.lastName, [Validators.required]),
        id: new FormControl(data.id, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]),
        gender: new FormControl(data.gender, [Validators.required]),
        email: new FormControl(data.email, [Validators.required, Validators.pattern(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)]),
        role: new FormControl(data.role, [Validators.required]),
        password: new FormControl('123', [Validators.required]),
      })
    } else {
      this.addUser = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        id: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]),
        gender: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.pattern(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)]),
        role: new FormControl('', [Validators.required]),
        password: new FormControl('123', [Validators.required]),
      })
    }
  }


  submit() {
    if (this.isEditting) {
      this.api.genericPost('/update-user', this.addUser.value)
        .subscribe({
          next: (res) => {
            this.snackbar.open('User updated succesfully', 'Ok', { duration: 3000 });
            this.dialogRef.close();
          },
          error: (err) => {
            this.snackbar.open('User was not updated, try again!', 'Ok', { duration: 3000 });
          },
          complete: () => { },
        })
    }

    else {
      this.api.genericGet('/get-users')
        .subscribe({
          next: (res: any) => {
            // if user doesnt exist
            if (res.length === 0) {
              // this.users = res; add user to database
              this.addUserApi();
              this.users.push(this.addUser.value)
            } else {
              this.users = res
              // if user already exist
              if (this.users.find((user: any) => user.id === this.addUser.value.id)) {
                this.snackbar.open(`user with this id ${this.addUser.value.id}  already exists`, 'OK')

              } else {
                this.addUserApi();
                this.users.push(this.addUser.value);
              }

            }
          },
          error: (err) => console.log('Error', err),
          complete: () => { }
        })
    }

  }

  addUserApi() {
    this.api.genericPost('/add-user', this.addUser.value)
      .subscribe({
        next: (res) => {
          this.snackbar.open('User add succesfully', 'OK');
        },
        error: (err) => console.log(err),
        complete: () => {
          this.sharedService.updateUsersWatch();
        }
      })
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  verifySouthAfricanID(idNumber: string): void {
    // Check if ID number length is correct
    if (idNumber.length !== 13) {
      return; // Exit the function if ID number length is incorrect
    }

    // Extract gender information
    const genderDigit = parseInt(idNumber.charAt(6));

    // Determine gender based on gender digit
    this.gender = genderDigit < 5 ? 'Female' : 'Male';

    // Update the value of the gender form control
    this.addUser.controls['gender'].setValue(this.gender);
  }
}


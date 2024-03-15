import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.scss']
})
export class AddUserFormComponent {
  roles: string[] = [' project manager', 'admin', 'team member']
  genders: string[] = ['male', 'female']

  users: any = [];

  addUser: FormGroup;

  constructor(private dialogRef: MatDialogRef<AddUserFormComponent>,
    private api: ApiService, private snackbar: MatSnackBar) {
    this.addUser = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      id: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]),
      gender: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', [Validators.required]),
      password: new FormControl('123', [Validators.required]),
    })
  }


  submit() {
    console.log("this.addUser.value", this.addUser.value)
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

  addUserApi() {
    this.api.genericPost('/add-user', this.addUser.value)
      .subscribe({
        next: (res) => {
          this.snackbar.open('User add succesfully', 'OK');
        },
        error: (err) => console.log(err),
        complete: () => { }
      })
      this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}

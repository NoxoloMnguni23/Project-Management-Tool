import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  changePasswordForm!: FormGroup
  user: any
  users: any

  constructor(private apiService: ApiService, private userInfor: SharedService, private snackBar: MatSnackBar, private matDialogRef: MatDialogRef<ChangePasswordComponent>) {

    this.user = this.userInfor.get('currentUser', 'session')
    this.users = this.apiService.genericGet('/get-users').subscribe((res) => {
      this.users = res;
    });

    this.changePasswordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    })
  }
  save() {
    let currentPassword = this.user.password
    this.apiService.genericPost(`/checkPassword`, {
      plainPassword: this.changePasswordForm.value.currentPassword,
      hashedPassword: currentPassword
    }).subscribe((res) => {
      if (!res) {
        this.snackBar.open('Your current password is incorrect', 'OK', { duration: 3000 })
      } else {
        if (this.changePasswordForm['controls']['confirmPassword'].value === this.changePasswordForm['controls']['newPassword'].value) {
          console.log("this.user.email", this.user.email)
          this.users.forEach((user: any, indx: number) => {
            if(user.email === this.user.email) {
              user.password = this.changePasswordForm['controls']['newPassword'].value
              this.apiService.genericPost('/update-user-password',user).subscribe({
                 next: (res: any) => {
                  console.log('changi passw resp')
                 } });
            }
          })
          console.log("this.users.email", this.users.email)
          this.close()
          this.snackBar.open('Your password, hass been changed successfully', 'OK', { duration: 3000 })
  
        } else {
          this.snackBar.open('New password and confirm password doesn\'t match', 'OK', { duration: 3000 })
        }
      }

    })

  }


  close() {
    this.matDialogRef.close()
  }
}



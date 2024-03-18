import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  loginForm: FormGroup;
  user: any;

  constructor(private sharedService: SharedService, private router: Router, private snackBar: MatSnackBar) {
    this.user = this.sharedService.get('users', 'local')
    if (!this.user.length) {
      this.sharedService.store([{
        fullName: 'Built-In Admin',
        email: 'admin@medicalcenter.ac.za',
        role: 'admin',
        phoneNumber: null,
        address: null,
        password: 'admin@12'
      }], 'users', 'local')
    }


    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  submit(): void {
    let _users = localStorage.getItem('users');
    const users = _users ? JSON.parse(_users) : [];
    if (this.loginForm.valid) {
      // Check if user exists
      const foundUser = users.find((user: any) => user.email === this.loginForm.controls["email"].value);

      // this.sharedService.currentUser = '';

      if (!foundUser) {
        this.snackBar.open('User does not exist.', 'OK', { duration: 3000 });
      } else if (foundUser.password !== this.loginForm.controls['password'].value) {
        this.snackBar.open('Password incorrect', 'OK', { duration: 3000 });
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(foundUser));
        this.router.navigate(['/landing'])

      }
    }
  }
  resetForm() {
    this.loginForm.reset()
  }

}

import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormsModule, Form } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;

  constructor(private snackBar: MatSnackBar, private apiService: ApiService, private router: Router) {

    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)])
    })
  }

  sendForgotEmail() {
    console.log("email", this.forgotPasswordForm.value)
    this.apiService.genericGet('/get-users').subscribe((res: any) => {
      const isFound = res.filter((user: any) => user.email === this.forgotPasswordForm.value.email);
      if (isFound.length === 0) {
        this.snackBar.open("Account doesn't exist", 'Ok', { duration: 3000 });
        return;
      }
      this.apiService.genericPost('/forgot-password', isFound[0])
        .subscribe({
          next: (res) => {
            this.snackBar.open('Check email for temporary password','Ok',{duration: 3000});
            this.router.navigate(['/login']);
           },
          error: (err) => { console.log(err) },
          complete: () => { }
        })
    })
  }
  resetForm() {
    this.forgotPasswordForm.reset();
  }
}

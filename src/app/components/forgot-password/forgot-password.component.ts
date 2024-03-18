import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormsModule, Form } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;

  constructor( private snackBar: MatSnackBar, private apiService : ApiService) {

    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      id: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]),
    })
  }

  sendForgotEmail(email: any){
    console.log("email", email)
      this.apiService.genericPost('/forgotPassword', this.forgotPasswordForm.value)
        .subscribe({
          next: (res) => { console.log(res) },
          error: (err) => { console.log(err) },
          complete: () => { }
        })
  }
  resetForm() {
    this.forgotPasswordForm.reset();
  }
}

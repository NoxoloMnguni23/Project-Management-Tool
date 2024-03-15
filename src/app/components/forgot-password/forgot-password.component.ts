import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormsModule, Form } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;

  constructor( private snackBar: MatSnackBar) {

    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      id: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]),
    })
  }

  sendEmail(){}
  resetForm() {
    this.forgotPasswordForm.reset();
  }
}

import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
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

  constructor(private sharedService: SharedService, private router: Router, private snackBar: MatSnackBar,
    private api: ApiService) {

    const Admin = {
      "firstName": "Administrator",
      "lastName": "Admin",
      "gender": "male",
      "id": "4564545645645",
      "email": "admin@gmail.com",
      "role": "admin",
      "password": "123"
    }

    this.api.genericGet('/get-users').subscribe((res: any) => {
      const isAdminFound = res.find((user: any) => user.email === Admin.email)
      if (isAdminFound) return;
      this.api.genericPost('/add-user', Admin)
        .subscribe((res) => console.log('Admin acc added.'))
    })

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  submit(): void {
    this.api.genericGet(`/login/${this.loginForm.value.email}/${this.loginForm.value.password}`).subscribe((res: any) => {
      console.log("res", res)
      if (!res.emailExists) {
        this.snackBar.open("Account does not exist", 'Ok', { duration: 3000 });
      }
      if (!res.passwordMatches) {
        this.snackBar.open("Password does not match", 'Ok', { duration: 3000 });
        return;
      }
      this.sharedService.store(res.userAcc, 'currentUser', 'session')
      this.router.navigate(['/landing/dashboard']);
    })
  }
  resetForm() {
    this.loginForm.reset()
  }

}

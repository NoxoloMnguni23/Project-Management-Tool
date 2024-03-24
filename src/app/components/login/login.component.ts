import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;
  user: any;
  spinnerElement: any;

  constructor(private sharedService: SharedService, private router: Router, private snackBar: MatSnackBar,
    private api: ApiService) {
    this.api.genericGet('/add-management-accounts').subscribe((res:any) => {
      console.log("Addded...",res)
    });

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)]),
      password: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.spinnerElement = document.getElementById('spinner') as HTMLElement | undefined;
  }

  submit(): void {
    this.progressSpinner('show');
    this.api.genericGet(`/login/${this.loginForm.value.email}/${this.loginForm.value.password}`).subscribe((res: any) => {
      this.progressSpinner('hide');
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

  progressSpinner(action: any) {
    switch (action) {
      case 'show':
        this.spinnerElement.classList.remove('hide');
        break;
      case 'hide':
        this.spinnerElement.classList.add('hide');
        break;
      default:
        break;
    }
  }
}

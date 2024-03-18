import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: any
  constructor(private service: SharedService, private matDialog: MatDialog) {
    this.user = this.service.get('currentUser', 'session')

  }
  changePassword(){
    this.matDialog.open(ForgotPasswordComponent)
  }

}

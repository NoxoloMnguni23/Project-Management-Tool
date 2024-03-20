import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { SharedService } from 'src/app/services/shared.service';
import { ChangePwComponent } from '../change-pw/change-pw.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: any

  constructor(private service: SharedService, private matDialog: MatDialog) {
    this.user = this.service.get('currentUser', 'session')
    // console.log("user",this.user);
  }

  
  changePassword(){
    this.matDialog.open(ChangePwComponent)
  }

}

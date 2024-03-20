import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: any

  constructor(private userInfo: SharedService, private matDialog: MatDialog) {
    this.user = this.userInfo.get('currentUser', 'session')
    
  }

  
  changePassword(){
    this.matDialog.open(ChangePasswordComponent)
  }

}

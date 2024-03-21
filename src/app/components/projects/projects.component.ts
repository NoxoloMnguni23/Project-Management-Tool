import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AddProjectComponent } from '../forms/add-project/add-project.component';
import { ApiService } from 'src/app/services/api.service';
import { ProjectComponent } from '../project/project.component';
import { SharedService } from 'src/app/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  hasAddedProjects: boolean = false;
  managerProjects: any;
  constructor(private dialog: MatDialog, private api: ApiService,
    private sharedService: SharedService, private snackbar: MatSnackBar) {
    this.sharedService.watchProjectsUpdate().subscribe((projectsUpdated: boolean) => {
      this.api.genericGet('/get-projects')
        .subscribe({
          next: (res: any) => {
            this.managerProjects = res;
            if (res.length > 0) {
              this.hasAddedProjects = true
            }
          },
          error: (err) => console.log(err),
          complete: () => { }
        })
    })
    this.api.genericGet('/get-projects')
      .subscribe({
        next: (res: any) => {
          this.managerProjects = res;
          if (res.length > 0) {
            this.hasAddedProjects = true
          }
        },
        error: (err) => console.log(err),
        complete: () => { }
      })
  }

  addProject(): void {
    const currentUser = this.sharedService.get('currentUser', 'session');
    if (currentUser.role === 'admin') {
      this.snackbar.open('View only admin permissions', 'Ok', { duration: 3000 });
      return;
    }
    this.dialog.open(AddProjectComponent, {
      width: '60%'
    })
  }

  showProject(project: any): void {
    const currentUser = this.sharedService.get('currentUser', 'session');
    if (currentUser.role === 'admin') {
      this.snackbar.open('View only admin permissions', 'Ok', { duration: 3000 });
      return;
    }
    this.dialog.open(ProjectComponent, {
      data: {
        _project: project
      },
      width: '100%',
      height: '90%'
    })
  }

}

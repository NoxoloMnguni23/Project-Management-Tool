import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AddProjectComponent } from '../forms/add-project/add-project.component';
import { ApiService } from 'src/app/services/api.service';
import { ProjectComponent } from '../project/project.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  hasAddedProjects: boolean = false;
  managerProjects: any;
  constructor(private dialog: MatDialog, private api: ApiService) {
    // @Inject(MAT_DIALOG_DATA) private _project: any
    // console.log("_project",_project)
    this.api.genericGet('/get-projects')
      .subscribe({
        next: (res) => {
          this.managerProjects = res;
          this.hasAddedProjects = true;
        },
        error: (err) => console.log(err),
        complete: () => { }
      })
  }

  addProject(): void {
    this.dialog.open(AddProjectComponent, {
      width: '60%'
    })
  }

  showProject(project: any): void {
    this.dialog.open(ProjectComponent, {
      data: {
        _project: project
      },
      width: '100%',
      height: '80%'
    })
  }

}

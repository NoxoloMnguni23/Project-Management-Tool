import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectComponent } from '../forms/add-project/add-project.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  constructor(private dialog: MatDialog) { }
  addProject(): void {
    this.dialog.open(AddProjectComponent,{
      width: '60%'
    })
  }
}

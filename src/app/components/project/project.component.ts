import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AddProjectComponent } from '../forms/add-project/add-project.component';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  hasChangedAssignments: boolean = false;
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail'];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  viewedProject: any;
  constructor(@Inject(MAT_DIALOG_DATA) private _project: any, private dialog: MatDialog) {
    this.viewedProject = _project._project;
  }

  editProject(): void {
    this.dialog.open(AddProjectComponent, {
      data: {
        _project: this.viewedProject
      }
    })
  }

  saveTaskAssignments(): void {
    console.log('assignment changed')
  }

  seeProjectTasks(): void {
    console.log('project tasks')
  }
}

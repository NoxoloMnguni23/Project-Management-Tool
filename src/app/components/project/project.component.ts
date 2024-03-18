import { Component, Inject, OnInit } from '@angular/core';
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
import { AddTaskComponent } from '../forms/add-task/add-task.component';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TasksComponent } from '../tasks/tasks.component';
import { SharedService } from 'src/app/services/shared.service';

declare let emailjs: any;

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  displayedColumns: string[] = ['todayDate', 'projectName', 'startDate', 'endDate', 'status', 'teamMembers', 'tasks'];
  dataSource!: any;
  hasChangedAssignments: boolean = false;
  projectTasks: any;
  projectTasksCount: any;
  pendingProjectTasksCount: any;
  usersList: any[] = [];
  tasksList: any[] = [];
  existingMembersTasksList: any[] = [];
  membersTasksList: any[] = [];
  viewedProject: any;
  constructor(@Inject(MAT_DIALOG_DATA) private _project: any, private dialog: MatDialog,
    private api: ApiService, private snackbar: MatSnackBar, private sharedService: SharedService) {
    this.viewedProject = _project._project;
    // To download

    this.getAssignedTasks();

    // Get all tasks
    this.api.genericGet('/get-tasks')
      .subscribe({
        next: (res: any) => {
          this.projectTasks = res;
          this.projectTasksCount = this.projectTasks.length
          this.pendingProjectTasksCount = this.projectTasks.filter((task: any) => task.status.toLowerCase() === 'completed').length;
        },
        error: (err) => console.log(err),
        complete: () => { }
      })

    // Save all assigned tasks
    this.api.genericGet('/assigned-tasks')
      .subscribe({
        next: (res: any) => {
          this.existingMembersTasksList = res;
        },
        error: (err) => console.log(err),
        complete: () => { }
      })

    this.api.genericGet('/get-users')
      .subscribe({
        next: (res: any) => {
          this.usersList = res;
        },
        error: (err) => console.log(err),
        complete: () => { }
      })

    this.api.genericGet('/get-tasks')
      .subscribe({
        next: (res: any) => {
          this.tasksList = res;
        },
        error: (err) => console.log(err),
        complete: () => { }
      })
  }

  ngOnInit(): void {
  }

  editProject(): void {
    this.dialog.open(AddProjectComponent, {
      data: {
        _project: this.viewedProject
      }
    })
  }

  saveTaskAssignments(): void {
    this.existingMembersTasksList.forEach((existingMemberTask: any) => {
      console.log("this.membersTasksList", this.membersTasksList)
      const isFound = this.membersTasksList.find((newMemberTask: any) => existingMemberTask.task._id === newMemberTask.task._id)
      // Clear member task on collection
      console.log("isFound", isFound)
      if (isFound) {
        this.api.genericDelete('/delete-assigned-task/' + existingMemberTask._id)
          .subscribe({
            next: (res: any) => { console.log('Deleted') },
            error: (err) => console.log(err),
            complete: () => { }
          })
      }
    })
    this.addAssignedTasks();
    this.snackbar.open('Tasks assigned successfully', 'Ok', { duration: 3000 });
    // Refresh
    this.getAssignedTasks();
  }

  addAssignedTasks(): void {
    this.membersTasksList.forEach((memberAndTask: any) => {
      // Save member task
      this.api.genericPost('/assign-task', memberAndTask)
        .subscribe({
          next: (res: any) => { },
          error: (err) => console.log(err),
          complete: () => { }
        })
    });
    this.hasChangedAssignments = false;
  }

  seeProjectTasks(): void {
    this.dialog.open(TasksComponent)
  }

  addNewTask(): void {
    this.dialog.open(AddTaskComponent, {
      data: {
        _project: this.viewedProject
      }
    });
  }

  getAssignedTasks(): void {
    // Save all assigned tasks
    this.api.genericGet('/assigned-tasks')
      .subscribe({
        next: (res: any) => {
          this.existingMembersTasksList = res;
          // temp
          let temp: any = [];
          console.log("this.existingMembersTasksList onInit", this.existingMembersTasksList)
          this.existingMembersTasksList.forEach((membersTasksList: any, indx: any) => {
            if (indx === 0) {
              temp.push({ projectName: this.viewedProject.projectName, startDate: this.viewedProject.startDate, endDate: this.viewedProject.endDate, status: this.viewedProject.status, teamMembers: `${membersTasksList.teamMember.firstName} ${membersTasksList.teamMember.lastName} `, tasks: membersTasksList.task.taskTitle })

              console.log("temp", temp)
              return;
            }
            console.log("temp", temp)
            temp.push({ projectName: null, startDate: null, endDate: null, status: null, teamMembers: `${membersTasksList.teamMember.firstName} ${membersTasksList.teamMember.lastName} `, tasks: membersTasksList.task.taskTitle })
          })
          this.dataSource = temp;
        },
        error: (err) => console.log(err),
        complete: () => { }
      })
  }

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
    const prevMembersTasksList = this.membersTasksList;
    this.membersTasksList = [];
    this.usersList.forEach((user: any, user_indx: any) => {
      this.tasksList.forEach((task: any, task_indx: any) => {
        if (user_indx === task_indx)
          this.membersTasksList.push({
            teamMember: user,
            task: task
          })
      })
    })
    console.log("this.membersTasksList", this.membersTasksList)
    // No changes made
    if (this.membersTasksList === prevMembersTasksList) return;
    this.hasChangedAssignments = true;
  }

  downloadSpreadsheet(): void {
    this.sharedService.downloadSpreadsheet('Project-Spreadsheet', this.dataSource);
  }

  sendEmail(): void {
    (function () {
      emailjs.init("-zPelKc0E3npVguLF");
    })();
    const params = {
      sender_name: "Project Management System",
      subject: "Task Assignment",
      message: "You have a pending assigned task",
      toEmail: "oh34swlling@gmail.com",
      reply_to: "Disabled"
    }
    const sendElement = document.getElementById('send')
    console.log("sendElement", sendElement)
    function send() {
      emailjs.sendForm('service_as60pvf', 'template_8387uqw', params)
        .then((res: any) => {
          console.log('res', res)
        })
    }
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  projectHealths: string[] = ['Good', 'At Risk', 'Needs Attension'];
  projectStatuses: string[] = ['Completed', 'Cancelled'];
  dataSource!: any;
  hasChangedAssignments: boolean = false;
  projectTasks: any;
  usersList: any[] = [];
  tasksList: any[] = [];
  existingMembersTasksList: any[] = [];
  newMembersTasksList: any[] = [];
  membersTasksList: any[] = [];
  viewedProject: any;
  projectHealth: any = 'Needs Attension';
  spinnerElement: any;
  toAssignTasks: any[] = [];
  tasksArr: any[] = [];
  currentItem: any;
  taskDropContainer: any[] = []
  constructor(@Inject(MAT_DIALOG_DATA) private _project: any, private dialog: MatDialog,
    private api: ApiService, private apiService: ApiService, private dialogRef: MatDialogRef<ProjectComponent>,
    private snackbar: MatSnackBar, private sharedService: SharedService) {
    this.viewedProject = _project._project;
    // To download

    this.sharedService.watchNoTasksUpdate().subscribe((tasksUpdated: boolean) => {
      this.api.genericGet('/get-tasks')
        .subscribe({
          next: (res: any) => {
            this.tasksList = res;
          },
          error: (err) => console.log(err),
          complete: () => { }
        })
    })
    this.getTasks()
    this.getAssignedTasks();

    // Get all tasks
    this.api.genericGet('/get-tasks')
      .subscribe({
        next: (res: any) => {
          this.projectTasks = res;
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
    this.prepareTasksData();
  }

  prepareTasksData() {
    this.api.genericGet('/get-users')
      .subscribe({
        next: (res: any) => {
          this.usersList = res.filter((user: any) => user.role.toLowerCase() === 'team member');
          this.usersList.forEach((teamMember: any) => {
            this.tasksArr.push({
              email: teamMember.email,
              employeeName: `${teamMember.firstName} ${teamMember.lastName}`,
              task: 'Not Set'
            })
          })
        },
        error: (err) => console.log(err),
        complete: () => { }
      })
  }

  fitlerTasks(task: any) {
    return this.tasksArr.filter((taskItem: any) => taskItem.task === task)
  }

  onDragStart(item: any) {
    this.currentItem = item;

  }

  onDrop(e: any, task: any) {
    const record = this.tasksArr.find((task: any) => task.email === this.currentItem.email)
    if (record) {
      record.task = task;
    }
    this.toAssignTasks.push(record);
    this.hasChangedAssignments = true;
  }

  onDragOver(e: any) {
    e.preventDefault();
  }

  ngOnInit(): void {
    this.spinnerElement = document.getElementById('spinner') as HTMLElement | undefined;
  }

  editProject(): void {
    this.dialogRef.close();
    this.dialog.open(AddProjectComponent, {
      data: {
        _project: this.viewedProject
      }
    })
  }

  saveTaskAssignments(): void {
    const confirmDelete = prompt('type confirm to assign tasks');
    if (confirmDelete?.toLowerCase() === 'confirm') {
      let tasksList: any;
      this.api.genericGet('/get-tasks')
        .subscribe({
          next: (res: any) => {
            tasksList = res;
            this.toAssignTasks.forEach((task: any) => {
              const isFoundUser = this.usersList.find((user: any) => user.email = task.email)
              const isFound = tasksList.find((_task: any) => _task.taskTitle = task.task)
              if (isFound && isFoundUser) {
                const memberAndTask = {
                  "teamMember": isFoundUser,
                  "task": isFound
                }
                // Get existing users task
                this.api.genericGet('/assigned-tasks').subscribe((res: any) => {
                })

                this.addAssignedTasks(memberAndTask);
              }
            })
          },
          error: (err) => console.log(err),
          complete: () => { }
        })
      // // Refresh
      // this.getAssignedTasks();
    } else {
      this.snackbar.open('Action cancelled', 'Ok', { duration: 3000 })
    }
  }

  addAssignedTasks(memberAndTask: any): void {
    // Save member task
    this.api.genericPost('/assign-task', memberAndTask)
      .subscribe({
        next: (res: any) => {
          this.snackbar.open('Tasks assigned successfully', 'Ok', { duration: 3000 });
          this.hasChangedAssignments = false;
          const emailPoints: any = {
            "task": memberAndTask.task.taskTitle,
            "email": memberAndTask.teamMember.email
          }
          this.api.genericPost('/taskEmail', emailPoints)
            .subscribe({
              next: (res) => {
              },
              error: (err) => { console.log(err) },
              complete: () => { }
            })
        },
        error: (err) => console.log(err),
        complete: () => { }
      })
    this.hasChangedAssignments = false;
  }

  seeProjectTasks(): void {
    // Get all tasks
    this.api.genericGet('/get-tasks')
      .subscribe({
        next: (res: any) => {
          if (res.length < 1) {
            this.snackbar.open('You need to add tasks', 'Ok', { duration: 3000 });
            return;
          };
          this.dialog.open(TasksComponent, { data: this.viewedProject })
        },
        error: (err) => console.log(err),
        complete: () => { }
      })
  }

  getTasks(){
    this.api.genericGet('/get-tasks')
      .subscribe({
        next: (res: any) => {
          this.taskDropContainer = res;
        },
        error: (err) => console.log(err),
        complete: () => { }
      })
  }

  addNewTask(): void {
    this.dialog.open(AddTaskComponent, { data: this.viewedProject });
  }

  getAssignedTasks(): void {
    // Save all assigned tasks
    this.api.genericGet('/assigned-tasks')
      .subscribe({
        next: (res: any) => {
          this.existingMembersTasksList = res;
          // temp
          let temp: any = [];
          this.existingMembersTasksList.forEach((membersTasksList: any, indx: any) => {
            if (indx === 0) {
              temp.push({ projectName: this.viewedProject.projectName, startDate: this.viewedProject.startDate, endDate: this.viewedProject.endDate, status: this.viewedProject.status, teamMembers: `${membersTasksList.teamMember.firstName} ${membersTasksList.teamMember.lastName} `, tasks: membersTasksList.task.taskTitle })

              return;
            }
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
    this.api.genericGet('/assigned-tasks').subscribe((res: any) => {
      this.newMembersTasksList = [];
      // Try swap loops
      this.membersTasksList.forEach((memberTaskList: any) => {
        res.forEach((res: any) => {
          if (memberTaskList.teamMember.email === res.teamMember.email && memberTaskList.task.taskDescription === memberTaskList.task.taskDescription) {
          } else {
            this.newMembersTasksList.push(memberTaskList);
          }
        })
      })
    })
    this.hasChangedAssignments = true;
  }

  downloadSpreadsheet(): void {
    this.sharedService.downloadSpreadsheet('Project-Spreadsheet', this.dataSource);
  }

  changeHealth(health: any): void {
    this.api.genericGet('/assigned-tasks').subscribe((res: any) => {
      const isFound = res.filter((memberAndTask: any) => memberAndTask.task.project === this.viewedProject._id);
      isFound.forEach((member: any) => {
        const emailPoints = {
          "healthStatus": health,
          "email": member.teamMember.email
        }
        this.api.genericPost('/projectHealthEmail',emailPoints).subscribe((res: any) => {
          console.log('Email health',res);
        })

      })
    })
    this.projectHealth = health;
    this.viewedProject.projectHealth = health;
    // Get all tasks
    this.api.genericPost('/update-project', this.viewedProject)
      .subscribe({
        next: (res: any) => {
          this.snackbar.open('Health updated successfully', 'Ok', { duration: 3000 });
        },
        error: (err) => console.log(err),
        complete: () => { }
      })
  }

  changeStatus(status: any) {
    this.viewedProject.status = status;
    this.api.genericPost('/update-project',this.viewedProject).subscribe((res: any) => {
      this.snackbar.open('Status updated successfully','OK',{duration: 3000});
    })
    this.api.genericGet('/assigned-tasks').subscribe((res: any) => {
      const isFound = res.filter((memberAndTask: any) => memberAndTask.task.project === this.viewedProject._id);
      isFound.forEach((member: any) => {
        const emailPoints = {
          "status": status,
          "email": member.teamMember.email
        }
        this.api.genericPost('/projectStatusEmail',emailPoints).subscribe((res: any) => {})
      })
    })
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

import { Component } from '@angular/core';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent {

  currentItem: any;

  tasksArr: any[] = [{
    email: 'thapeloghothini1@gmail.com',
    employeeName: 'Thapelo Mokotelakoena',
    task: 'Not Set'
  }, {
    email: 'thapeloghothini2@gmail.com',
    employeeName: 'Thabiso Theza',
    task: 'Not Set'
  }, {
    email: 'thapeloghothini3@gmail.com',
    employeeName: 'Olerato Phelo',
    task: 'Not Set'
  }, {
    email: 'thapeloghothini4@gmail.com',
    employeeName: 'Thulani Motlatsi',
    task: 'Not Set'
  }, {
    email: 'thapeloghothini6@gmail.com',
    employeeName: 'Kevin Matuta',
    task: 'Landing Page'
  }, {
    email: 'thapeloghothini7@gmail.com',
    employeeName: 'Lesego Tlatsi',
    task: 'Landing Page'
  }, {
    email: 'thapeloghothini8@gmail.com',
    employeeName: 'Tumisang John',
    task: 'Not Set'
  }, {
    email: 'thapeloghothini9@gmail.com',
    employeeName: 'Phala Trinity',
    task: 'Authentication'
  }, {
    email: 'thapeloghothini10@gmail.com',
    employeeName: 'Tlotlo Katleho',
    task: 'Authentication'
  }]

  fitlerTasks(task: any) {
    return this.tasksArr.filter((taskItem: any) => taskItem.task === task)
  }

  onDragStart(item: any) {
    console.log("item", item)
    this.currentItem = item;

  }

  onDrop(e: any, task: any) {
    console.log("onDrop e", e)
    const record = this.tasksArr.find((ticket: any) => ticket.email === this.currentItem.email)
    if (record) {
      record.task = task;
    }
    // this.currentItem = null;
  }

  onDragOver(e: any) {
    e.preventDefault();
    // console.log("onDrag e",e)
  }

}

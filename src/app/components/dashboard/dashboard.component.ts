import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit, OnInit {

  @ViewChild('lineChart') private lineChartRef!: ElementRef;
  @ViewChild('pieChart') private pieChartRef!: ElementRef;
  private lineChart: any;
  private pieChart: any;

  usersTeamMembers: any = [];
  usersMembers: any = [];
  userNumTasks: any = [];
  onlyCompleteProjects: any = 0;
  numberOfCompletedTasks: any = [];
  numberOfPendingTasks: any = [];
  numberOfInProgressTasks: any = [];


  jan: any = 2;
  feb: any = 3;
  april: any = 4;
  march: any = 4;



  ngOnInit(): void {
    this.createLineChart();
    this.createPieChart();
  }

  ngAfterViewInit(): void {
    this.createPieChart();
    this.createLineChart();
   
  }

  user: any;
  hasProjects: boolean = false;
  hasUsers: boolean = false;
  numberOfProjects: any = 0;
  numberOfUsers: any;
  monthlyProjects: any[] = [];
  monthlyProjectsCounts: any;
  lineDataArr: any[] = []


  constructor(private userInfo: SharedService, private apiService: ApiService) {
    this.numUsers()
    this.numOfTaskCompleted()
    this.user = this.userInfo.get('currentUser', 'session');
    console.log("user", this.user)

    this.apiService.genericGet('/get-projects')
      .subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            this.hasProjects = true;
            this.numberOfProjects = res.length;
            this.onlyCompleteProjects = res.filter((project: any) => project.status.toLowerCase() === 'completed').length;
            console.log("num", this.numberOfProjects)


            let projectDates: any = [];
            this.monthlyProjectsCounts = {
              jan: 0,
              feb: 0,
              mar: 0,
              apr: 0,
              may: 0,
              jun: 0,
              july: 0,
            }
            // Get projects months
            res.forEach((project: any) => {
              projectDates.push(project.createDate)
            })

            projectDates.forEach((month: any) => {
              switch (Number(month)) {
                case 0:
                  this.monthlyProjectsCounts.jan++;
                  break;
                case 1:
                  this.monthlyProjectsCounts.feb++;
                  break;
                case 2:
                  this.monthlyProjectsCounts.mar++;
                  console.log("this.monthlyProjectsCounts", this.monthlyProjectsCounts)
                  break;
                case 3:
                  this.monthlyProjectsCounts.apr++;
                  break;
                case 4:
                  this.monthlyProjectsCounts.may++;
                  break;
                case 5:
                  this.monthlyProjectsCounts.jun++;
                  break;
                case 6:
                  this.monthlyProjectsCounts.july++;
                  break;
              }
            })
            this.createLineChart();
          }
        },
        error: (err) => console.log(err),
        complete: () => { }
      })

  }

  numUsers() {
    this.apiService.genericGet('/get-users').subscribe({
      next: (res: any) => {
        this.usersMembers = res.filter((user: any) => user.role !== 'admin');
        this.usersTeamMembers = res.filter((user: any) => user.role === 'team member');
      }
    })
  }
  numTasksUser() {
    this.apiService.genericGet('/assigned-tasks').subscribe({
      next: (res: any) => {
        this.userNumTasks = res.filter((user: any) => user.id === this.user.id.value)
      }
 
    })
  }
  numOfTaskCompleted() {
    this.apiService.genericGet('/assigned-tasks').subscribe({
      next : (res: any) => {
        this.userNumTasks = res.filter((user: any) => user.teamMember.id.value === this.user.id.value)
        this.numberOfCompletedTasks = res.filter((user: any) => user.task.status === 'Completed')
        this.numberOfPendingTasks = res.filter((user: any) => user.task.status === 'Pending')
        this.numberOfInProgressTasks = res.filter((user: any) => user.task.status === 'In-Progress')
        this.createPieChart();
      }
    })
  }

  

  private createLineChart(): void {
    const ctx = this.lineChartRef?.nativeElement?.getContext('2d');
    this.lineChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Monthly Projects',
          data: [this.monthlyProjectsCounts.jan, this.monthlyProjectsCounts.feb, this.monthlyProjectsCounts.mar,
          this.monthlyProjectsCounts.apr, this.monthlyProjectsCounts.may, this.monthlyProjectsCounts.jun,
          this.monthlyProjectsCounts.july],
          // fill: false,
          borderColor: 'rgb(75, 192, 192)',
          // tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  private createPieChart(): void {
    const ctx = this.pieChartRef.nativeElement.getContext('2d');
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Completed','Pending','In-Progress'],
        datasets: [{
          label: 'Progress',
          data: [this.numberOfCompletedTasks.length, this.numberOfPendingTasks.length, this.numberOfInProgressTasks.length],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}






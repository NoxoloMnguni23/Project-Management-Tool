import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit{

  @ViewChild('lineChart') private lineChartRef!: ElementRef;
  @ViewChild('pieChart') private pieChartRef!: ElementRef;
  private lineChart: any;
  private pieChart: any;

  usersTeamMembers: any = [];
  usersMembers: any = [];
  userNumTasks  : any = [];



  ngAfterViewInit(): void {
    this.createLineChart();
    this.createPieChart();
  }

  user: any;
  hasProjects: boolean = false;
  hasUsers: boolean = false;
  numberOfProjects: any;
  numberOfUsers: any;


  constructor(private userInfo: SharedService, private apiService: ApiService) {
    this.numUsers()
    this.user = this.userInfo.get('currentUser', 'session');
    console.log("user",this.user)

    this.apiService.genericGet('/get-projects')
      .subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            this.hasProjects = true;
            this.numberOfProjects = res.length;
            console.log("num", this.numberOfProjects)
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
  numTasksUser(){
    this.apiService.genericGet('/assigned-tasks').subscribe({
      next: (res: any) => {
        this.userNumTasks = res.filter((user: any) => user.id ===  this.user.id.value)
      }
    })
  }


  private createLineChart(): void {
    const ctx = this.lineChartRef?.nativeElement?.getContext('2d');
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Sample Line Data',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
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
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: 'Sample Pie Data',
          data: [12, 19, 3, 5, 2, 3],
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






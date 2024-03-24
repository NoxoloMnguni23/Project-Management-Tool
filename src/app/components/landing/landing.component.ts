import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  user: any
  menuItems: any[] = []
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private userInfo: SharedService, private api: ApiService) {
    this.user = this.userInfo.get('currentUser', 'session');

    this.router.navigate(['/landing/dashboard'])

    if (this.user.role === 'admin') {
      this.menuItems = [
        { label: 'dashboard', icon: 'dashboard', route: '/landing/dashboard' },
        { label: 'profile', icon: 'person', route: '/landing/profile' },
        { label: 'projects', icon: 'hub', route: '/landing/schedules' },
        { label: 'users', icon: 'group', route: '/landing/users' },
      ]
    } else if (this.user.role === 'project manager') {
      this.menuItems = [
        { label: 'dashboard', icon: 'dashboard', route: '/landing/dashboard' },
        { label: 'profile', icon: 'person', route: '/landing/profile' },
        { label: 'projects', icon: 'hub', route: '/landing/projects' },
        { label: 'Team members', icon: 'task', route: '/landing/team-members' },
        
      ]
    } else if (this.user.role === 'team member') {
      this.menuItems = [
        { label: 'dashboard', icon: 'dashboard', route: '/landing/dashboard' },
        { label: 'profile', icon: 'person', route: '/landing/profile' },
        { label: 'task', icon: 'task', route: '/landing/tasks' },
      ]
    }
  }
  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}



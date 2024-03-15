import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserInfoService } from 'src/app/services/user-info.service';

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

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private userInfo: UserInfoService) {
    this.user = this.userInfo.get('currentUser', 'session');

    // this.router.navigate(['/landing/dashboard'])
    if (this.user.role === 'admin') {
      this.menuItems = [
        { label: 'dashboard', icon: 'dashboard', route: '/landing/dashboard' },
        { label: 'profile', icon: 'group', route: '/landing/profile' },
        { label: 'users', icon: 'person', route: '/landing/users' },
        { label: 'projects', icon: 'group', route: '/landing/projects' },
      ]
    } else if (this.user.role === 'manager') {
      this.menuItems = [
        { label: 'dashboard', icon: 'dashboard', route: '/landing/dashboard' },
        { label: 'profile', icon: 'personal_injury', route: '/landing/profile' },
        { label: 'team-members', icon: 'event_available', route: '/landing/team-members' },
        { label: 'projects', icon: 'person', route: '/landing/projects' },
        { label: 'new-project', icon: 'group', route: '/landing/new-project' },
 
      ]
    } else if (this.user.role === 'team-member') {
      this.menuItems = [
        { label: 'dashboard', icon: 'dashboard', route: '/landing/dashboard' },
        { label: 'profile', icon: 'event_available', route: '/landing/profile' },
        { label: 'tasks', icon: 'personal_injury', route: '/landing/tasks' },
      ]
    }
  }
  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}


import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

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

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private userInfo: SharedService) {
    this.user = this.userInfo.get('currentUser', 'session');

    this.router.navigate(['/landing/dashboard'])
    if (this.user.role === 'admin') {
      this.menuItems = [ 
        { label: 'dashboard', icon: 'dashboard', route: '/landing/dashboard' },
        { label: 'profile', icon: 'person', route: '/landing/profile' },
        { label: 'users', icon: 'group', route: '/landing/users' },
        { label: 'projects', icon: 'group_work', route: '/landing/projects' },
      ]
    } else if (this.user.role === 'manager') {
      this.menuItems = [
        { label: 'dashboard', icon: 'dashboard', route: '/landing/dashboard' },
        { label: 'profile', icon: 'person', route: '/landing/profile' },
        { label: 'team-members', icon: 'group', route: '/landing/team-members' },
        { label: 'projects', icon: 'group_work', route: '/landing/projects' },
        { label: 'new-project', icon: 'group_work', route: '/landing/new-project' },
 
      ]
    } else if (this.user.role === 'team-member') {
      this.menuItems = [
        { label: 'dashboard', icon: 'dashboard', route: '/landing/dashboard' },
        { label: 'profile', icon: 'person', route: '/landing/profile' },
        { label: 'tasks', icon: 'group_work', route: '/landing/tasks' },
      ]
    }
  }
  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}


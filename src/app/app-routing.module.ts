import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LandingComponent } from './components/landing/landing.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UsersComponent } from './components/users/users.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ManagerGuard } from './guards/manager.guard';
import { AdminGuard } from './guards/admin.guard';
import { LandingGuard } from './guards/landing.guard';
import { TeamMembersComponent } from './components/team-members/team-members.component';

const routes: Routes = [{ path: '', redirectTo: '/login', pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{ path: 'forgotpassword', component: ForgotPasswordComponent },
{
  path: 'landing', component: LandingComponent,canActivate:[LandingGuard], children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'users', component: UsersComponent },
    { path: 'tasks', component: TasksComponent },
    { path: 'projects', component: ProjectsComponent }, 
    { path: 'team-members', component: TeamMembersComponent, }, 
  ]
},
{ path: '**', component: PageNotFoundComponent },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from 'src/material/material.module';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UsersComponent } from './components/users/users.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LandingComponent } from './components/landing/landing.component';
import { AddProjectComponent } from './components/forms/add-project/add-project.component';
import { TableComponent } from './components/table/table.component';
import { AddUserFormComponent } from './components/add-user-form/add-user-form.component';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ProjectComponent } from './components/project/project.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { AddTaskComponent } from './components/forms/add-task/add-task.component';
import { LineComponent } from './components/charts/line/line.component';
import { NgChartsModule } from 'ng2-charts';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { TeamMembersComponent } from './components/team-members/team-members.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    ProfileComponent,
    UsersComponent,
    TasksComponent,
    ProjectsComponent,
    PageNotFoundComponent,
    LandingComponent,
    AddProjectComponent,
    TableComponent,
    AddUserFormComponent,
    ProjectComponent,
    AddTaskComponent,
    LineComponent,
    ChangePasswordComponent,
    TeamMembersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MaterialModule,
    HttpClientModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    CdkDropListGroup,
    CdkDrag,
    CdkDropList,
    NgChartsModule,
    CdkTreeModule
  ],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: {} },{ provide: MatDialogRef, useValue: {} }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

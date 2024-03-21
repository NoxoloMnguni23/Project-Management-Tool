import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LandingGuard implements CanActivate {

  user: any;
  isUser: boolean = false;
  constructor(private router: Router, private shared: SharedService, private location: Location, private userInfo: SharedService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.user = sessionStorage.getItem('currentUser')
    if (this.user) {
      return this.isUser = true;
    } else {
      this.router.navigate(['/login'])
      this.location.back()
      return this.isUser = false;
    }

  }

}

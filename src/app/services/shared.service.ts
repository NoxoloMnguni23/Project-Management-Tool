import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  currentUser : any ;
  
  constructor() { }
  get(key: string, sessionType: string): any {
    let data = sessionType === 'session' ? sessionStorage.getItem(key) : localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  store(value: any, key: string, sessionType: string): void {
    sessionType === 'session' ? sessionStorage.setItem(key, JSON.stringify(value)) : localStorage.setItem(key, JSON.stringify(value));
    console.log ('User stored')
  }
}

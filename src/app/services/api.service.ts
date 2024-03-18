import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = environment.nodeAppUrl;

  constructor(private http: HttpClient) {
  }
  genericGet(endpointUrl: string) {
    return this.http.get(this.url + endpointUrl)
  }

  genericPost(endpointUrl: string,payload: any){
    return this.http.post(this.url + endpointUrl , payload)
  }
  genericDelete(endpointUrl: string){
    return this.http.delete(this.url + endpointUrl)
  }

}

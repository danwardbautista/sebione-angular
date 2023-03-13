import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SebioneApiService {

  constructor(private http: HttpClient) { }
  token:any;


  // isUserLoggedIn: boolean = false;

  getHeaders(){
    let token = localStorage.getItem('userToken');
    // let token = 'ff';

    let httpOptionsWithBearer = {
      headers: new HttpHeaders({'Accept': 'application/json', 'Authorization': 'Bearer ' + token})
    };
    return httpOptionsWithBearer
  }

  login(data: any) {
    console.log(data);
    return this.http.post('http://localhost:8000/api/login', data)
      .pipe(map((res: any) => {
        return res;
      }))
  }

  logout() {
    return this.http.get('http://localhost:8000/api/logout', this.getHeaders())
      .pipe(map((res: any) => {
        return res;
      }))
  }

  getCurrentUser() {
    return this.http.get('http://localhost:8000/api/getuser', this.getHeaders())
    .pipe(map((res: any) => {
      return res;
    }))
  }

  getCompaniesAPI() {
    return this.http.get('http://localhost:8000/api/company', this.getHeaders())
    .pipe(map((res: any) => {
      return res;
    }))
  }

  postCompaniesAPI(data: any) {
    console.log(data);
    return this.http.post('http://localhost:8000/api/company', data, this.getHeaders())
      .pipe(map((res: any) => {
        return res;
      }))
  }

  editCompaniesAPI(data: any, id: number) {
    console.log(data);
    return this.http.post('http://localhost:8000/api/company/' +id, data, this.getHeaders())
      .pipe(map((res: any) => {
        return res;
      }))
  }

  deleteCompaniesAPI(id: number) {
    console.log(id);
    return this.http.delete('http://localhost:8000/api/company/' + id, this.getHeaders())
      .pipe(map((res: any) => {
        return res;
      }))
  }

  getEmployeesAPI() {
    return this.http.get('http://localhost:8000/api/employee', this.getHeaders())
    .pipe(map((res: any) => {
      return res;
    }))
  }

  postEmployeesAPI(data: any) {
    console.log(data);
    return this.http.post('http://localhost:8000/api/employee', data, this.getHeaders())
      .pipe(map((res: any) => {
        return res;
      }))
  }

  editEmployeesAPI(data: any, id: number) {
    console.log(data);
    return this.http.post('http://localhost:8000/api/employee/' +id, data, this.getHeaders())
      .pipe(map((res: any) => {
        return res;
      }))
  }

  deleteEmployeesAPI(id: number) {
    console.log(id);
    return this.http.delete('http://localhost:8000/api/employee/' + id, this.getHeaders())
      .pipe(map((res: any) => {
        return res;
      }))
  }
}

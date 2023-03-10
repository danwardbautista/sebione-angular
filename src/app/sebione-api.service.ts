import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SebioneApiService {

  constructor(private http: HttpClient) { }
  bearer:any;

  getHeaders(){
    let httpOptionsWithBearer = {
      headers: new HttpHeaders({'Accept': 'application/json'})
    };
    return httpOptionsWithBearer
  }

  getCompaniesAPI() {
    return this.http.get('http://localhost:8000/api/company')
    .pipe(map((res: any) => {
      return res;
    }))
  }

  postCompaniesAPI(data: any) {
    console.log(data);
    return this.http.post('http://localhost:8000/api/company', data)
      .pipe(map((res: any) => {
        return res;
      }))
  }
}

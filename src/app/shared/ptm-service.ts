import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn:'root'})
export class PtmService{


    private baseServerURL: string = '';
    private mockResponseDelay: number = 5000; // Delay in Milliseconds to get data from Mock json
    constructor(private httpClient: HttpClient) {
      this.baseServerURL = 'http://localhost:5000';
    }
  
    fetchData(endpoint: String, params: Object): Observable<any> {
      const apiUrl = this.baseServerURL + endpoint//+ this.apiMapping.appendParamsToUrl(endpoint, params);
      return this.httpClient.get(apiUrl);
    }
  
    postData(endpoint: String, params: Object, options: Object): Observable<any> {
     const apiUrl = this.baseServerURL +endpoint //this.appendParamsToUrl(endpoint, params);
    /*  console.log(apiUrl); */
     return this.httpClient.post(apiUrl, options);
    }

    appendParamsToUrl(url, options): string {
      let params = new URLSearchParams();
      for (let key in options) { if (key) { params.set(key, options[key]); } }
      return Object.keys(options).length > 0 ? url + '?' + params.toString() : url;
  }




}
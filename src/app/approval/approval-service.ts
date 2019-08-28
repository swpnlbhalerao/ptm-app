import {  Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PtmService } from "../shared/ptm-service";
import { of } from "rxjs";

@Injectable({providedIn:"root"})
export class ApprovalService{

     a = [{id:1,name:'Swapnil',paymentDate:'2018-10-01',crtDate:'2018-10-01'},{id:2,name:'Swapnil',paymentDate:'2018-10-01',crtDate:'2018-10-01'},{id:3,name:'Swapnil',paymentDate:'2018-10-01',crtDate:'2018-10-01'}];
     b = [{id:4,name:'Swapnil',paymentDate:'2018-10-01',crtDate:'2018-10-01'},{id:5,name:'Swapnil',paymentDate:'2018-10-01',crtDate:'2018-10-01'},{id:6,name:'Swapnil',paymentDate:'2018-10-01',crtDate:'2018-10-01'}];
    constructor(private http: HttpClient,private ptmService:PtmService){

    }

    getPayApprovals(){
        return of(this.a);
    }

    getRegApprovals(){
        return of(this.b);
    }

}
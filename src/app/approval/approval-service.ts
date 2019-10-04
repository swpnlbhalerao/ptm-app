import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PtmService } from "../shared/ptm-service";
import { of } from "rxjs";

@Injectable({ providedIn: "root" })
export class ApprovalService {


    constructor(private http: HttpClient, private ptmService: PtmService) {
    }

    getApprovals(type: String) {
        const object = {
            type: type
        }
        return this.ptmService.postData('/api/getPendingAprovals', null, object)
    }

    proccessRequest(type:String,id:String,status:String,mdyby:string,remarks:String) {
        const object = {
            type: type,
            id:id,
            status:status,
            mdyBy:mdyby,
            remarks:remarks
        }
        return this.ptmService.postData('/api/processRequest', null, object)
    }



}
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { PtmService } from '../shared/ptm-service';

@Injectable({ providedIn: "root" })
export class payService {

    constructor(private ptmService: PtmService, private http: HttpClient) {

    }


    fetchPaymentData(userName: string, year: number) {
        const object = {
            userName: userName,
            year: year
        };
        return this.ptmService.postData('/api/getPayHistByUser', null, object);

    }


}
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthServices {





login(email: string , password: string) {
    return of('failure');
}



}

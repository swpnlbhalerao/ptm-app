import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return next.handle(request).pipe(retry(2),
            catchError((error: HttpErrorResponse) => {
                console.log(" Error Object ",error)
                let errorMessage = 'An unknow error occurred';
                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = `Error: ${error.error.message}`;
                }if (error.error instanceof ProgressEvent) {
                    // client-side error
                    errorMessage = `Error: ${error.message}`;
                } if (error.error.message) {
                    errorMessage = `Error: ${error.error.message}`;
                }else {
                    errorMessage = `Error Code: ${error.status} \nMessage: ${error.message}`;
                }
                ///console.log("error-interceptor",errorMessage);
                return throwError(errorMessage);
            })
        )
    }

}

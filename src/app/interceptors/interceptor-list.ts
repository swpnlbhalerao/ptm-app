import { HTTP_INTERCEPTORS } from '@angular/common/http';
//import { AuthInterceptor } from './interceptor/auth-interceptor-service';
import { ErrorInterceptor } from './error-interceptor'


export const interceptProviders = [
  /*   {
        provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }, */
    {
        provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true
    }
    
]
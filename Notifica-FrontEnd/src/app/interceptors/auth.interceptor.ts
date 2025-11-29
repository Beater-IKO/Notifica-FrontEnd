import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = localStorage.getItem('jwt-token');

        if (token) {
            console.log('[AuthInterceptor] adding Authorization header for', request.url, 'tokenPreview:', token.substring(0, 10) + '... (len=' + token.length + ')');
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else {
            console.log('[AuthInterceptor] No token found for', request.url);
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                    localStorage.removeItem('token');
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
}

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('jwt-token');

    if (token) {
      // Debug: log URL and token presence (do not leak token to remote logs)
      try {
        // Only print token length to avoid exposing token content in console
        const tokenPreview = token ? `${token.substring(0, 10)}... (len=${token.length})` : 'none';
        console.debug('[AuthInterceptor] adding Authorization header for', request.url, 'tokenPreview:', tokenPreview);
      } catch (e) {
        console.debug('[AuthInterceptor] adding Authorization header for', request.url);
      }

      const authReq = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(authReq);
    }

    return next.handle(request);
  }
}
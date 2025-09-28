import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  getApiUrl(): string {
    const isDocker = window.location.port === '80' || window.location.port === '';
    
    if (isDocker) {
      return 'http://host.docker.internal:8080/api';
    } else {
      return 'http://localhost:8080/api';
    }
  }
}
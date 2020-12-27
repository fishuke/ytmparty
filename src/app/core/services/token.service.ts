import {Injectable} from '@angular/core';

@Injectable()
export class TokenService {

  getToken(): string {
    return localStorage.token;
  }

  saveToken(token: string): void {
    localStorage.token = token;
  }

  destroyToken(): void {
    localStorage.removeItem('token');
  }
}

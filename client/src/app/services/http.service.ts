import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  verifyAuthCode(code: string) {
    return this.http.post(
      '/api/auth/verify-auth-code',
      { code },
      {
        headers: {
          'X-Requested-With': 'XmlHttpRequest',
        },
      }
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as dayjs from 'dayjs';

import { Auth } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authUser: Auth;

  constructor(
    private http: HttpClient,
    private router: Router,
    private zone: NgZone
  ) {
    this.init();
  }

  init() {
    const authenticatedUser = JSON.parse(localStorage.getItem('user'));
    if (this.isLoggedIn()) {
      this.authUser = authenticatedUser;
    }
  }

  verifyGoogleSignIn(token: string) {
    return this.http
      .post<Auth>('/api/auth/signin/google', { token })
      .subscribe((res) => {
        this.authUser = res;
        localStorage.setItem('user', JSON.stringify(this.authUser));
        this.zone.run(() => {
          this.router.navigate(['/home']);
        });
      });
  }

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

  isLoggedIn() {
    const authenticatedUser = JSON.parse(localStorage.getItem('user'));
    return dayjs().isBefore(authenticatedUser?.expiresAt || null);
  }

  logOut() {
    this.authUser = null;
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}

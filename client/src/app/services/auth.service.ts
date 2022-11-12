import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    if (authenticatedUser) {
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

  isLoggedIn() {
    return dayjs().isBefore(this.authUser?.expiresAt);
  }

  logOut() {
    this.authUser = null;
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}

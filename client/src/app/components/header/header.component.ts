import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { ScriptService } from 'src/app/services/script.service';

declare const google: any;

@Injectable()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  googleAuthClient;
  constructor(
    public authService: AuthService,
    private renderer: Renderer2,
    private scriptService: ScriptService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadGoogleClientSDK();
    }
  }

  private loadGoogleClientSDK() {
    // Load the Google Identity Services script used to authorize the application to access the user's Google calendar.
    const scriptElement = this.scriptService.loadScript(
      this.renderer,
      'https://accounts.google.com/gsi/client'
    );
    scriptElement.onload = () => {
      this.googleAuthClient = google.accounts.oauth2.initCodeClient({
        client_id:
          '560815842329-hvoumt6mkor2qv549qj7kc259godonqv.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/calendar.app.created',
        ux_mode: 'popup',
        callback: (response) => {
          console.log(response);
          this.httpService
            .verifyAuthCode(response.code)
            .subscribe((data) => console.log(data));
          // this.http.post<any>('/api/auth/verify-auth-code', {
          //   code: response.code,
          // });
        },
      });
    };
    scriptElement.onerror = () => {
      console.log('Could not load the Google Script!');
    };
  }

  onClickOpenAuthWindow() {
    if (this.googleAuthClient) {
      this.googleAuthClient.requestCode();
    }
  }

  onLogout() {
    this.authService.logOut();
  }
}

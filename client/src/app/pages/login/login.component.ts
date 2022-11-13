import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { ScriptService } from 'src/app/services/script.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private scriptService: ScriptService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return;
    }

    // Load the Google Identity Services script and display the the Google sign-in button
    this.scriptService
      .loadScript(this.renderer, 'https://accounts.google.com/gsi/client')
      .then(() => {
        google.accounts.id.initialize({
          client_id:
            '560815842329-hvoumt6mkor2qv549qj7kc259godonqv.apps.googleusercontent.com',
          callback: ({ credential }) => {
            this.authService.verifyGoogleSignIn(credential);
          },
          ux_mode: 'popup',
          context: 'signin',
        });
        google.accounts.id.renderButton(
          document.getElementById('googleBtn') as HTMLElement,
          {
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            theme: 'outline',
            text: 'signin_with',
            logo_alignment: 'left',
          }
        );
      })
      .catch((error) => console.log(error));
    // scriptElement.onload = () => {
    //   google.accounts.id.initialize({
    //     client_id:
    //       '560815842329-hvoumt6mkor2qv549qj7kc259godonqv.apps.googleusercontent.com',
    //     callback: ({ credential }) => {
    //       this.authService.verifyGoogleSignIn(credential);
    //     },
    //     ux_mode: 'popup',
    //     context: 'signin',
    //   });
    //   google.accounts.id.renderButton(
    //     document.getElementById('googleBtn') as HTMLElement,
    //     {
    //       size: 'large',
    //       type: 'standard',
    //       shape: 'rectangular',
    //       theme: 'outline',
    //       text: 'signin_with',
    //       logo_alignment: 'left',
    //     }
    //   );
    // };
    // scriptElement.onerror = () => {
    //   console.log('Could not load the Google Script!');
    // };
  }
}

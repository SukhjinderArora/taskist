import { Component, Injectable, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ScriptService } from 'src/app/services/script.service';
import { TasksService } from 'src/app/services/tasks.service';

declare const google: any;

@Injectable()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  googleAuthClient;
  syncing = false;

  constructor(
    public authService: AuthService,
    private renderer: Renderer2,
    private scriptService: ScriptService,
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    this.loadGoogleClientSDK();
  }

  private loadGoogleClientSDK() {
    // Load the Google Identity Services script used to authorize the application to access the user's Google calendar.
    const script = this.scriptService.loadScript(
      this.renderer,
      'https://accounts.google.com/gsi/client'
    );

    script.onload = () => {
      this.googleAuthClient = google.accounts.oauth2.initCodeClient({
        client_id:
          '560815842329-hvoumt6mkor2qv549qj7kc259godonqv.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/calendar.app.created',
        ux_mode: 'popup',
        callback: (response) => {
          this.authService.verifyAuthCode(response.code).subscribe(() => {});
        },
      });
    };
  }

  onClickOpenAuthWindow() {
    if (this.googleAuthClient) {
      this.googleAuthClient.requestCode();
    }
  }

  onClickSyncEvents() {
    this.syncing = true;
    this.tasksService.syncEventsAndTasks().subscribe(() => {
      this.tasksService.getAllTasks();
      this.syncing = false;
    });
  }

  onLogout() {
    this.authService.logOut();
  }
}

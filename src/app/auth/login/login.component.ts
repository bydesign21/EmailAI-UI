import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MicrosoftAuthService } from '../microsoft-auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        opacity: 0,
        transform: 'scale(0.5)',
        height: '0px',
        margin: '0'
      })),
      state('expanded', style({
        opacity: 1,
        transform: 'scale(1)',
        width: '100%'
      })),
      transition('collapsed => expanded', animate('300ms ease-in')),
      transition('expanded => collapsed', animate('300ms ease-out'))
    ])
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(private cd: ChangeDetectorRef,
    private router: Router,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private authService: AuthService,
    private messageService: NzMessageService,
    private msAuth: MicrosoftAuthService
  ) { }

  isHideGoogle = false;
  isHideMicrosoft = false;
  isOptionSelected = false;
  isLoading = false;
  private googleClientId: string = '519177719908-1ah4snkmlbhgham3bvs47i9sb95f2hso.apps.googleusercontent.com';
  private destroy$ = new Subject<void>();


  ngOnInit(): void {
    const isAuthenticated = JSON?.parse(sessionStorage.getItem('isAuthenticated') || 'false');
    const authFlow: string = JSON?.parse(sessionStorage?.getItem('credential') || 'false')?.type;

    console.log('authFlow', authFlow);
    if (isAuthenticated) {
      this.ngZone.run(async () => {
        await this.router.navigate(['dashboard', 'home'], { replaceUrl: true, skipLocationChange: false });
        this.cd.detectChanges();
      });
    }

    this.route.queryParams.subscribe(params => {
      if (authFlow === 'Google') {
        this.handleGoogleCodeUrl(params);
      }
    });


  }

  handleGoogleCodeUrl(params: Params) {
    const code = params['code'];
    console.log('code', code);
    if (code) {
      console.log('getOauthToken', code);
      this.getOauthToken(code, 'Google');
    } else {
      console.log('code not found');
    }
  }

  ngOnDestroy(): void {
    this.cd.detach();
    this.destroy$.next();
    this.destroy$.complete();
  }

  getOauthToken(code: string, type: string) {
    this.isLoading = true;
    this.authService.getOauthToken(code, type)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (response: any) => {
          console.log('response', response);
          if (response) {
            sessionStorage.setItem('credential', JSON.stringify({ type, value: response.access_token, refresh_token: response.refresh_token, expiration: response.expiry_date }));
            sessionStorage.setItem('isAuthenticated', 'true');
            this.ngZone.run(async () => {
              await this.router.navigate(['dashboard', 'home'], { replaceUrl: true, skipLocationChange: false });
              this.isLoading = false;
              this.cd.detectChanges();
            });
          }
        },
        error: (err: string) => {
          console.error('err', err);
          this.messageService.error(err);
        },
      });
  }

  signInWithGoogle(): void {
    sessionStorage.setItem('credential', JSON.stringify({ type: 'Google', value: '', refresh_token: '', expiration: '' }));
    this.isOptionSelected = true;
    this.isHideMicrosoft = true;
    this.cd.detectChanges();
    // Define your OAuth2 parameters
    const clientId = this.googleClientId;
    const redirectUri = 'http://localhost:4200/auth/login';
    const responseType = 'code';
    const scope = 'https://www.googleapis.com/auth/gmail.readonly';
    const accessType = 'offline';
    const prompt = 'consent';  // Force re-consent to get a refresh token

    // Construct the OAuth2 URL
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=${accessType}&prompt=${prompt}`;

    // Redirect the user to the OAuth2 consent screen
    window.location.href = authUrl;
  }


  async signInWithMicrosoft() {
    this.isOptionSelected = true;
    this.isHideGoogle = true;
    this.cd.detectChanges();
    await this.authService.handleMicrosoftLogin().then((tokens) => {
      sessionStorage.setItem('credential', JSON.stringify(tokens));
      this.ngZone.run(async () => {
        await this.router.navigate(['dashboard', 'home'], { replaceUrl: true, skipLocationChange: false });
        this.isLoading = false;
        this.cd.detectChanges();
      })
    });
  }

}

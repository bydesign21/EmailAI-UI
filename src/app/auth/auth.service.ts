import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, map, of } from 'rxjs';
import { MicrosoftAuthService } from './microsoft-auth.service';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private client: HttpClient,
    private msAuth: MicrosoftAuthService,
    private msalService: MsalService
  ) { }

  getOauthToken(accessCode: string, authType: string): Observable<string> {
    console.log('accessCode', accessCode);
    return this.client.get(
      `https://gtvera4bp8.execute-api.us-east-1.amazonaws.com/dev/core/oauth/?code=${accessCode}&type=${authType}`,
      { observe: 'response' }
    ).pipe(
      map((response: HttpResponse<any>) => {
        if (response.body.success && response.body.data) {
          return response?.body?.data;
        } else {
          throw response?.body?.error?.message;
        }
      })
    );
  }

  async handleMicrosoftLogin() {
    await lastValueFrom(this.msalService.initialize())
    const tokens = await lastValueFrom(this.msalService.acquireTokenPopup({ scopes: ['user.read', 'mail.read'] }).pipe(map(response => {
      return {
        type: 'Microsoft',
        value: response?.accessToken,
        refresh_token: response?.code,
        expiration: (response?.expiresOn)?.getTime()
      }
    })))
    return tokens;
  }

  checkSession(): Observable<boolean> {
    console.log('checkSession')
    const credentialItem = sessionStorage.getItem('credential');

    if (!credentialItem) {
      // No credential item found in session storage
      console.error('No credentials found in session storage');
      return of(false);
    }

    try {
      const creds = JSON.parse(credentialItem);
      console.log('creds', creds);
      const { expiration } = creds;
      const currentTime = new Date().getTime();
      console.log('currentTime', currentTime);
      console.log('expiry_date', expiration);
      console.log('isCurrentTimeGreaterThanExpiryDate', currentTime > expiration);
      if (currentTime > expiration) {
        this.logout();
        return of(false);
      } else {
        return of(true);
      }
    } catch (error) {
      console.error('Error parsing credentials from session storage:', error);
      return of(false);
    }
  }


  logout() {
    sessionStorage.clear();
  }
}

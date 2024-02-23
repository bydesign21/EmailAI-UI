import { Injectable } from '@angular/core';
import { Configuration, PublicClientApplication } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root'
})
export class MicrosoftAuthService {
  static msalInstanceFactory(): PublicClientApplication {
    return new PublicClientApplication({
      auth: {
        clientId: '9c1d1bba-5350-4c68-a6ea-5c821f5c82c0',
        redirectUri: 'http://localhost:4200/auth/login',
        authority: 'https://login.microsoftonline.com/common',
      }
    });
  }

  public async generateStaticCodeChallenge() {
    const staticCodeVerifier = "MyStaticCodeVerifier12345"; // Static code verifier
    const encoder = new TextEncoder();
    const data = encoder.encode(staticCodeVerifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const code = btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    console.log('code', code);
    return code;
  }
}

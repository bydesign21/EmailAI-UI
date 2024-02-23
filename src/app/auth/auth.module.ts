import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth.routes';
import { AuthContainerComponent } from './auth-container/auth-container.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { GoogleOutline, WindowsOutline, LoadingOutline } from '@ant-design/icons-angular/icons';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './auth.service';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { MicrosoftAuthService } from './microsoft-auth.service';
import { MsalModule, MsalService } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';

const icons = [GoogleOutline, WindowsOutline, LoadingOutline];

@NgModule({
  declarations: [AuthContainerComponent, LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    RouterModule,
    AuthRoutingModule,
    NzIconModule.forChild(icons),
    HttpClientModule,
    NzMessageModule,
    NzSpinModule,
    MsalModule.forRoot(
      MicrosoftAuthService.msalInstanceFactory(),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['user.read', 'mail.read'] // Add additional scopes as needed
        }
      }, {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map([
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ])
    }
    ),
  ],
  exports: [AuthContainerComponent, LoginComponent, RegisterComponent],
  providers: [
    provideAnimations(),
    AuthService,
    provideHttpClient(),
    MicrosoftAuthService,
  ]
})
export class AuthModule { }

import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard-container',
  standalone: false,
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.scss'
})
export class DashboardContainerComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private messageService: NzMessageService
  ) { }

  async handleLogout() {
    this.authService.logout();
    await this.router.navigate(['/auth/login'], { replaceUrl: true, skipLocationChange: false }).then(() => this.cd.detectChanges());
    this.messageService.success('Logout successful');
  }
}

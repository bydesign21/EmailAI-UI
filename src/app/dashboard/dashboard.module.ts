import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';
import { dashboardRoutes } from './dashboard.routes';
import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';
import { HomeComponent } from './home/home.component';
import { EmailCountModule } from '../shared-components/email-count/email-count.module';
import { EmailSentimentAnalysisPercentageModule } from '../shared-components/email-sentiment-analysis-percentage/email-sentiment-analysis-percentage.module';
import { HighPriorityEmailCountModule } from '../shared-components/high-priority-email-count/high-priority-email-count.module';
import { EmailTableModule } from '../shared-components/email-table/email-table.module';
import { provideHttpClient } from '@angular/common/http';
import { DashboardService } from './dashboard.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { EmailModalContentModule } from '../shared-components/email-modal-content/email-modal-content.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PoweroffOutline } from '@ant-design/icons-angular/icons';
import { AuthModule } from '../auth/auth.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

const icons = [PoweroffOutline];

@NgModule({
  declarations: [DashboardContainerComponent, HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoutes),
    EmailCountModule,
    EmailSentimentAnalysisPercentageModule,
    HighPriorityEmailCountModule,
    EmailTableModule,
    NzButtonModule,
    NzModalModule,
    NzToolTipModule,
    EmailModalContentModule,
    NzIconModule.forChild(icons),
    AuthModule
  ],
  providers: [
    provideRouter(dashboardRoutes),
    provideHttpClient(),
    DashboardService
  ]
})
export class DashboardModule { }

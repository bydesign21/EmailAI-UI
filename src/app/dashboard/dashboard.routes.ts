import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { DashboardContainerComponent } from "./dashboard-container/dashboard-container.component";
import { AuthGuardService } from "../auth/auth-guard.service";

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardContainerComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent }
    ]
  }
]

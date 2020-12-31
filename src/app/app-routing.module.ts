import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from '@design/layout/layout.component';
import {NonAuthGuard} from '@core/guards/non-auth.guard';
import {AuthGuard} from '@core/guards/auth.guard';


const routes: Routes = [
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./feature/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard],
      },
    ]
  },
  {
    path: 'landing',
    loadChildren: () => import('./feature/landing/landing.module').then(m => m.LandingModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./feature/login/login.module').then(m => m.LoginModule),
    canActivate: [NonAuthGuard],
  },
  {
    path: '**',
    redirectTo: 'landing'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

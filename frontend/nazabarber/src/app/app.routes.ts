import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminTurnosComponent } from './pages/admin/admin-turnos/admin-turnos.component';
import { AdminHistorialComponent } from './pages/admin/admin-historial/admin-historial.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'turnos', component: AdminTurnosComponent },
      { path: 'historial', component: AdminHistorialComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

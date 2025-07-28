import { Routes } from '@angular/router';

import { HomeComponent }     from './pages/home/home.component';
import { LoginComponent }    from './pages/login/login.component';
import { UsuarioComponent }  from './pages/usuario/usuario.component';
import { MisTurnosComponent } from './pages/usuario/mis-turnos/mis-turnos.component';
import { PerfilComponent }    from './pages/usuario/perfil/perfil.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminTurnosComponent }    from './pages/admin/admin-turnos/admin-turnos.component';
import { AdminHistorialComponent } from './pages/admin/admin-historial/admin-historial.component';
import { RegistroComponent } from './pages/registro/registro/registro.component';
import { RedSocialComponent } from './pages/red-social/red-social.component';
import { PostFeedComponent } from './pages/red-social/post-feed/post-feed.component';
import { CrearPostComponent } from './pages/red-social/crear-post/crear-post.component';
import { PostItemComponent } from './pages/red-social/post-item/post-item.component';

import { AdminGuard }   from './guards/admin.guard';
import { UsuarioGuard } from './guards/usuario.guard';
import { RedSocialGuard } from './guards/red-social.guard';


export const routes: Routes = [
  /* público */
  { path: '',          component: HomeComponent },
  { path: 'login',     component: LoginComponent },
  { path: 'registro',  component: RegistroComponent },

  /* panel USUARIO  (protección con UsuarioGuard) */
  {
    path: 'usuario',
    canActivate: [UsuarioGuard],
    component: UsuarioComponent,
    children: [
      { path: '', redirectTo: 'mis-turnos', pathMatch: 'full' },
      { path: 'mis-turnos', component: MisTurnosComponent },
      { path: 'perfil', component: PerfilComponent }
    ]
  },

  /* panel ADMIN (protección con AdminGuard) */
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'turnos',    component: AdminTurnosComponent },
      { path: 'historial', component: AdminHistorialComponent }
    ]
  },

  /* red social */
  {
    path: 'red-social',
    component: RedSocialComponent,
    canActivate: [RedSocialGuard],
    children: [
      { path: '', redirectTo: 'post-feed', pathMatch: 'full' },
      { path: 'post-feed', component: PostFeedComponent },
      { path: 'crear-post', component: CrearPostComponent },
      { path: 'post/:id', component: PostItemComponent }
    ]
  },

  /* comodín */
  { path: '**', redirectTo: '' }
];

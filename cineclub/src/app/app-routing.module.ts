import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultadoBusquedaApiComponent } from './components/resultado-busqueda-api/resultado-busqueda-api.component';
import { HomeComponent, } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { ListaPostComponent } from './components/lista-post/lista-post.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ConfiguracionComponent } from './components/usuario/configuracion/configuracion.component';
import { MensajesRecibidosComponent } from './components/usuario/mensajes-recibidos/mensajes-recibidos.component';
import { PostsComponent } from './components/usuario/posts/posts.component';
import { MensajesEnviadosComponent } from './components/usuario/mensajes-enviados/mensajes-enviados.component';
import { BuscadorComponent } from './components/usuario/buscador/buscador.component';
import { ResultadoBusquedaDbComponent } from './components/resultado-busqueda-db/resultado-busqueda-db.component';
import { LoginGuard } from './guards/login.guard';
import { TokenValidatorGuard } from './guards/token-validator.guard';
import { AdminUsersComponent } from './components/usuario/admin-users/admin-users.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent },
  { path: 'searchapi', component: ResultadoBusquedaApiComponent },
  {
    path: 'searchdb', component: ResultadoBusquedaDbComponent
  },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'posts', component: ListaPostComponent },
  {
    path: 'usuarios', component: UsuarioComponent,
    canActivateChild: [LoginGuard, TokenValidatorGuard],
    children: [
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'mensajesrecibidos', component: MensajesRecibidosComponent },
      { path: 'mensajesenviados', component: MensajesEnviadosComponent },
      { path: 'posts', component: PostsComponent },
      { path: 'buscador', component: BuscadorComponent },
      { path: 'adminusers', component: AdminUsersComponent }
    ]
  },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


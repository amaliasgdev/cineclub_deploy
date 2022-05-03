import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavegadorComponent } from './components/navegador/navegador.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResultadoBusquedaApiComponent } from './components/resultado-busqueda-api/resultado-busqueda-api.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { ListaPostComponent } from './components/lista-post/lista-post.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ConfiguracionComponent } from './components/usuario/configuracion/configuracion.component';
import { MensajesRecibidosComponent } from './components/usuario/mensajes-recibidos/mensajes-recibidos.component';
import { MensajesEnviadosComponent } from './components/usuario/mensajes-enviados/mensajes-enviados.component';
import { PostsComponent } from './components/usuario/posts/posts.component';
import { FormsModule } from '@angular/forms';
import { BuscadorComponent } from './components/usuario/buscador/buscador.component';
import { ResultadoBusquedaDbComponent } from './components/resultado-busqueda-db/resultado-busqueda-db.component';
import { ValidTokenInterceptor } from './interceptors/valid-token.interceptor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminUsersComponent } from './components/usuario/admin-users/admin-users.component';


@NgModule({
  declarations: [
    AppComponent,
    NavegadorComponent,
    ResultadoBusquedaApiComponent,
    HomeComponent,
    RegistroComponent,
    LoginComponent,
    ListaPostComponent,
    UsuarioComponent,
    ConfiguracionComponent,
    MensajesRecibidosComponent,
    MensajesEnviadosComponent,
    PostsComponent,
    BuscadorComponent,
    ResultadoBusquedaDbComponent,
    AdminUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ValidTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

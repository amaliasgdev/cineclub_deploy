import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { ObservableUserService } from '../services/observable-user.service';
import { UsuarioService } from '../services/usuario.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Injectable({
  providedIn: 'root'
})
export class TokenValidatorGuard implements CanActivateChild {

  constructor
    (private usuarioService: UsuarioService,
      private router: Router,
      private observableUser: ObservableUserService) { }

  async canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    //Cogemos el token
    const token = localStorage.getItem('token');

    //Caso 1. No hay token. Mensaje y cierre de sesion
    if (!token) {
      console.log('GUARD: No hay token')
    }

    //Caso 2. Hay token. Llamamos al servicio que se conectará al servidor para comprobar si el Token sigue siendo valido
    let response = await this.usuarioService.isTokenExpired();
    if (response === 'expirado' || response === 'no hay token') {
      localStorage.removeItem('token');
      //Avisar al observable
      this.observableUser.setToken('');
      this.router.navigate(['/home']);
      console.log('Token expirado / No hay Token')
      Swal.fire(
        `Error`,
        `Token expirado. Vuelve a logearte`,
        'success');
      return false;
    } else {
      //obtener id del usuario      l
      console.log('Token correcto')
      return true;
    }


  }
}



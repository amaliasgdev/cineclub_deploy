import { Injectable } from '@angular/core';
import { CanActivateChild, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ObservableUserService } from '../services/observable-user.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivateChild {

  constructor(private observableUserService: ObservableUserService) { }

  canActivateChild(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.isLogged()) {
      return true;
    }
    Swal.fire(
      'Error',
      'Debe estar logeado',
      'error'
    );
    return false;
  }

  isLogged(): boolean {
    if (this.observableUserService.isLogged()) {
      return true
    }
    return false;
  }

}

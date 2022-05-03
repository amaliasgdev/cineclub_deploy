import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ObservableUserService } from 'src/app/services/observable-user.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { User } from 'src/interfaces/user.interface';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formulario: FormGroup;
  response: string;
  username: string;
  user: User;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private observableUserService: ObservableUserService
  ) {
    this.response = '';
    this.username = '';
    this.formulario = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9!.]{5,14}$/)
      ])
    });
  }

  ngOnInit(): void {

  }

  async onSubmit() {
    const response = await this.usuarioService.login(this.formulario.value);
    const token = response.token;
    /////////////////////////////////////////////////////
    //Le paso al Observable el token del usuario logeado
    this.observableUserService.setToken(token);
    /////////////////////////////////////////////////////
    if (response.success === 'Login correcto') {
      this.user = await this.usuarioService.getByToken(token);
      let username = this.user.username.toUpperCase();
      this.formulario.reset;
      this.router.navigate(['/home']);
      Swal.fire(
        'OK',
        `Bienvenido/a ${username}`,
        'success');
    } else {
      Swal.fire(
        'Error',
        `${response.error}`,
        'error'
      );
    }
  }


  checkError(fieldName: string, error: string) {
    return this.formulario.get(fieldName).hasError(error) && this.formulario.get(fieldName).touched;
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ObservableUserService } from 'src/app/services/observable-user.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-navegador',
  templateUrl: './navegador.component.html',
  styleUrls: ['./navegador.component.css']
})
export class NavegadorComponent implements OnInit {

  formulario: FormGroup;
  user: boolean;
  username: any;
  role: any;
  usuarioId: any;
  imagen: String;
  imgImagenUrl: String;

  constructor(
    private router: Router,
    private observableUserService: ObservableUserService,
    private usuarioService: UsuarioService) {
    this.username = null;
    this.formulario = new FormGroup({
      titulo: new FormControl('', [
        Validators.required,
        Validators.minLength(10)
      ])
    });
    this.user = false;
    this.role = null;
    this.usuarioId = null;
    this.imagen = null;
    //this.imgImagenUrl = 'http://localhost:3000/image/';
    this.imgImagenUrl = 'https://cineclub-back.herokuapp.com/image/';
  }

  ngOnInit(): void {
    //Caso de reinicio de VSCode o cierre de ventana. Entonces recuperamos el Token de localStorage ya que en el observable se ha borrado. Desde aquí enviamos al Observable el valor del Token en el LocalStorage para que esté informado
    let token = localStorage.getItem('token')
    if (token !== null) {
      this.observableUserService.recoverToken(localStorage.getItem('token'));
      if (token !== '') {
        this.usuarioService.getByToken(token).then(response => {
          this.username = response.username;
          this.usuarioId = response.id;
          this.role = response.rol;
          this.user = true;
          this.imagen = response.imagen;
        })
      } else {
        this.username = null;
        this.usuarioId = null;
        this.role = null;
        this.user = false;
        this.imagen = null;
      }
    }

    //Caso de modificacion de Token. En caso de modificación de Token nos suscribiremos al observable (ejemplo, al logearse para que no haya que reiniciar la pagina)
    this.observableUserService.getToken$().subscribe(token => {
      //si hay token      
      if (token !== '') {
        this.usuarioService.getByToken(token).then(response => {
          this.username = response.username;
          this.usuarioId = response.id;
          this.role = response.rol;
          this.imagen = response.imagen;
          this.user = true;
        })
      } else {
        this.username = null;
        this.usuarioId = null;
        this.role = null;
        this.imagen = null;
        this.user = false;
      }
    });

  }

  checkError(fieldName: string, error: string) {
    return this.formulario.get(fieldName).hasError(error) && this.formulario.get(fieldName).touched;
  }

  onClickCerrar() {
    this.observableUserService.setToken('');
    this.user = false;
    this.router.navigate(['/']);
  }

  onSubmit() {
    let titulo = (this.formulario.value.titulo);
    this.formulario.reset();
    this.router.navigate(['/searchdb'], { queryParams: { titulo: titulo } });
  }

}

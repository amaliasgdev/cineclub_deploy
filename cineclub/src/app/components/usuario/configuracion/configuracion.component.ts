import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { User } from 'src/interfaces/user.interface';
import { ObservableUserService } from 'src/app/services/observable-user.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {


  user: any;
  modal: Modal | undefined;
  modal2: Modal | undefined;
  formulario: FormGroup;
  formularioImagen: FormGroup;
  files;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private observableUsuario: ObservableUserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.createFormImage();
    this.activatedRoute.parent!.params.subscribe((params) => {
      //const usuarioId = parseInt(params['usuarioId']);
      this.usuarioService.getById().then(result => {
        this.user = result;
      });
    });
  }

  async open() {
    this.createForm(this.user);
    const modalTest = document.getElementById('datosModal');
    if (modalTest) {
      this.modal = new Modal(modalTest, {
        keyboard: false
      });
    }
    this.modal?.show();
  }

  async openImagen() {
    // this.createFormImage();
    const modalTest2 = document.getElementById('imagenModal');
    if (modalTest2) {
      this.modal2 = new Modal(modalTest2, {
        keyboard: false
      });
    }
    this.modal2?.show();
  }

  checkError(fieldName: string, error: string) {
    return this.formulario.get(fieldName).hasError(error) && this.formulario.get(fieldName).touched;
  }

  async onSubmit() {
    if (this.formulario.value.password !== this.formulario.value.repite_password) {
      this.formulario.reset;
      return Swal.fire(
        'Error',
        'Las password no coinciden',
        'error'
      );
    }
    this.formulario.reset;
    const response = await this.usuarioService.update(this.user.id, this.formulario.value);
    if (response.affectedRows <= 0) {
      return Swal.fire(
        'Error',
        `${response}`,
        'error');
    }
    Swal.fire(
      'Ok',
      'Usuario modificado correctamente',
      'success');

    window.location.reload();
  }



  async onSubmitImagen() {
    let fd = new FormData();
    fd.append('imagen', this.files[0]);
    // Delegamos el envío del formulario en el servicio
    const response = await this.usuarioService.updateImagen(this.user.id, fd);
    if (response.affectedRows <= 0) {
      return Swal.fire(
        'Error',
        `${response}`,
        'error');
    }
    this.router.navigate(['/home']);
    this.observableUsuario.setToken('');
    Swal.fire(
      'Ok',
      'Imagen cambiada correctamente.\nPor favor, vuelva a logearse para ejecutar los cambios.',
      'success');
  }

  createForm(usuario: User) {
    this.formulario = new FormGroup({
      username: new FormControl(usuario.username, [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl(usuario.email, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9!.]{5,14}$/)
      ]),
      repite_password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9!.]{5,14}$/),
      ])
    });
  }

  createFormImage() {
    this.formularioImagen = new FormGroup({
      imagen: new FormControl()
    });
  }

  //cuando siba una imagen la guardo en files
  onChange($event) {
    this.files = $event.target.files;
  }


}








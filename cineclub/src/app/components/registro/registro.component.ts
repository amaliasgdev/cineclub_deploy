import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  files;
  formulario: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.formulario = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9!.]{5,14}$/)
      ]),
      repite_password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9!.]{5,14}$/)
      ])
    });
  }

  ngOnInit(): void {

  }

  async onSubmit() {
    let fd = new FormData();
    fd.append('imagen', this.files[0]);
    fd.append('username', this.formulario.value.username);
    fd.append('email', this.formulario.value.email);
    fd.append('password', this.formulario.value.password);
    // Delegamos el envío del formulario en el servicio
    this.usuarioService.create(fd).then(result => {
      //console.log(result)
      if (result.affectedRows === 1) {
        Swal.fire(
          `Correcto`,
          `Usuario creado correctamente.\nPor favor, inicie sesión`,
          'success');
      }
      this.router.navigate(['/home']);
    })
  }


  checkError(fieldName: string, error: string) {
    return this.formulario.get(fieldName).hasError(error) && this.formulario.get(fieldName).touched;
  }

  onChange($event) {
    this.files = $event.target.files;
  }

}

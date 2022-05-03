import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  arrUsuarios: any;
  imgImagenUrl: string;

  constructor(private usuarioServicio: UsuarioService) {
    //this.imgImagenUrl = 'http://localhost:3000/image/';
    this.imgImagenUrl = 'https://cineclub-back.herokuapp.com/image/';
  }

  async ngOnInit() {
    this.arrUsuarios = await this.usuarioServicio.getAll();
  }


  async onClick(pUsuarioId: number, rol: string) {
    let rolChange;
    if (rol === 'admin') {
      rolChange = 'user'
    } else {
      rolChange = 'admin'
    }

    const response = await this.usuarioServicio.updateRolById(pUsuarioId, { rol: rolChange });
    if (response.affectedRows === 1) {
      Swal.fire(
        `Correcto`,
        `Rol modificado correctamente`,
        'success');
      this.arrUsuarios = [];
      this.arrUsuarios = await this.usuarioServicio.getAll();
    } else {
      Swal.fire(
        `Error`,
        `No se ha podido modificar el rol del usuario`,
        'error');
    }
  }

  async onClickEliminar(pUsuarioId: number) {
    const response = await this.usuarioServicio.deleteById(pUsuarioId);
    console.log(response)
    console.log(response)
    if (response.affectedRows === 1) {
      Swal.fire(
        `Correcto`,
        `Usuario eliminado correctamente`,
        'success');
      this.arrUsuarios = [];
      this.arrUsuarios = await this.usuarioServicio.getAll();
    } else {
      Swal.fire(
        `Error`,
        `No se ha podido eliminar al usuario`,
        'error');
    }
  }

}
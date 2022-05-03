import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {


  datosUsuario: any;
  arrPost: any;
  arrMensajes: any;
  usuarioId: number;
  admin: boolean;
  imagen: String;
  imgUrl: String;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService) {
    this.admin = false;
    this.imagen = null;
    this.imgUrl = 'https://cineclub-back.herokuapp.com/image/';
  }

  async ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.usuarioId = parseInt(params['usuarioId']);
      this.isAdmin();
    });
  }

  async isAdmin() {
    const user = await this.usuarioService.getByToken(localStorage.getItem('token'));
    this.imagen = user.imagen;
    if (user.rol === 'admin') {
      this.admin = true;
    }
  }


}

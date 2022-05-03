import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PeliculaService } from 'src/app/services/pelicula.service';
import { PublicacionService } from 'src/app/services/publicacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { getFecha } from '../../utils/fechas.js';
import { faStar, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  arrPeliculas: any;
  imgUrl: string;
  admin: boolean;
  page: number;
  numPaginas: number;
  faStar: IconDefinition;

  constructor(
    private publicacionService: PublicacionService,
    private peliculaService: PeliculaService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.imgUrl = 'https://image.tmdb.org/t/p/w500';
    this.arrPeliculas = [];
    this.admin = false;
    this.page = 1;
    this.faStar = faStar;
  }

  async ngOnInit() {
    this.getPublicaciones();
    this.isAdmin();
  }

  async getPublicaciones() {
    let publPaginadas = await this.publicacionService.getAllPaginated(this.page);
    //Recorrer las publicaciones y añadir al objeto pelicula las estrellas
    for (let pub of publPaginadas) {
      const [valoracion] = await this.publicacionService.getRating(pub.idPublicacion);
      //se inserta el rating
      let rating = (valoracion.rating * 2).toFixed(2);
      pub.rating = rating;
      //se calculan las estrellas y se insertan
      let ratingTruncate = Math.trunc(parseInt(rating));
      let stars = this.getStars(ratingTruncate);
      pub.stars = stars;
    }
    //Añadir a la pelicula de la API el id, la fecha y las estrellas de la publicacion (no se puede hacer un JOIN porque es externa)
    this.arrPeliculas = [];
    for (let publicacion of publPaginadas) {
      const pelicula = await this.peliculaService.getById(publicacion.pelicula_id);
      pelicula.publicacionId = publicacion.idPublicacion;
      pelicula.fecha = getFecha(publicacion.fecha);
      pelicula.stars = publicacion.stars;
      pelicula.ratingCineBlog = publicacion.rating;
      this.arrPeliculas.push(pelicula);
    }
    //Conseguir el numero de paginas para la paginacion
    const allPublicaciones = await this.publicacionService.getAll();
    this.numPaginas = Math.trunc(allPublicaciones.length / 10) + 1;
  }

  async isAdmin() {
    let token = localStorage.getItem('token');
    if (token) {
      const user = await this.usuarioService.getByToken(token);
      if (user.rol === 'admin') {
        this.admin = true;
      }
    }
  }

  async onClickVer(pIdPublicacion: any) {
    this.router.navigate(['/posts'], { queryParams: { publicacionId: pIdPublicacion } });
  }

  async onClickBorrar(pIdPublicacion: any) {
    const response = await this.publicacionService.deleteById(pIdPublicacion);
    if (response.affectedRows === 1) {
      this.arrPeliculas = [];
      this.numPaginas = 0;
      this.getPublicaciones();
      Swal.fire(
        `Ok`,
        'Publicacion eliminada correctamente',
        'success');

    } else {
      Swal.fire(
        'Error',
        `${response.error}`,
        'error'
      );
    }
    // window.location.reload();
  }

  async cambiaPagina(siguiente: boolean) {
    if (siguiente) {
      this.page++;
    } else {
      this.page--;
    }
    this.getPublicaciones();
  }


  getStars(pRating: number) {
    let ratingTruncate = Math.trunc(pRating);
    let stars;
    switch (ratingTruncate) {
      case 1:
      case 2:
        stars = 1;
        break;
      case 3:
      case 4:
        stars = 2;
        break;
      case 5:
      case 6:
        stars = 3;
        break;
      case 7:
      case 8:
        stars = 4;
        break;
      case 9:
      case 10:
        stars = 5;
        break;
      default:
        stars = 0;
    }
    return stars;
  }



}


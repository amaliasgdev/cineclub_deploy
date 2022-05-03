import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PeliculaService } from 'src/app/services/pelicula.service';
import { PublicacionService } from 'src/app/services/publicacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { getFecha } from '../../utils/fechas.js';
import { faStar, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-resultado-busqueda-db',
  templateUrl: './resultado-busqueda-db.component.html',
  styleUrls: ['./resultado-busqueda-db.component.css']
})
export class ResultadoBusquedaDbComponent implements OnInit {

  titulo: any;
  arrBusqueda: any;
  arrPeliculas: any;
  imgUrl: String;
  paginaActual: any;
  numPaginas: any;
  admin: boolean;
  faStar: IconDefinition;

  constructor(
    private activatedRoute: ActivatedRoute,
    private publicacionService: PublicacionService,
    private peliculaService: PeliculaService,
    private router: Router,
    private usuarioService: UsuarioService) {
    this.imgUrl = 'https://image.tmdb.org/t/p/w500';
    this.arrBusqueda = [];
    this.arrPeliculas = [];
    this.admin = false;
    this.faStar = faStar;
  }


  ngOnInit(): void {
    this.isAdmin();
    this.activatedRoute.queryParams.subscribe(params => {
      this.titulo = params['titulo'];
      this.publicacionService.getByTitle(this.titulo)
        .then((result) => {
          this.arrBusqueda = result;
          this.arrBusqueda.forEach((resultado) => {
            this.peliculaService.getById(resultado.pelicula_id)
              .then((result) => {
                //se le añade la puntuacion
                this.publicacionService.getRating(resultado.idPublicacion).then(res => {
                  let [rate] = res;
                  let rating = Number(rate.rating) * 2;
                  let ratingTruncate = Math.trunc(rating);
                  let stars = this.getStars(ratingTruncate);
                  result.rating = rating.toFixed(2);
                  result.stars = stars;
                })
                //se le añade el id de la publicacion y su fecha
                result.publicacionId = resultado.idPublicacion;
                result.fecha = resultado.fecha;
                this.arrPeliculas.push(result);
              });
          });
        }).catch(error => {
          console.log(error)
        })
      console.log(this.arrPeliculas)
    });
  }


  async isAdmin() {
    const user = await this.usuarioService.getByToken(localStorage.getItem('token'));
    if (user.rol === 'admin') {
      this.admin = true;
    }
  }

  async onClickVer(pIdPublicacion: any) {
    this.router.navigate(['/posts'], { queryParams: { publicacionId: pIdPublicacion } });
  }

  async onClickBorrar(pIdPublicacion: any) {
    const borrado = await this.publicacionService.deleteById(pIdPublicacion);
    window.location.reload();
  }

  formatoFecha(fecha: any) {
    return getFecha(fecha);
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

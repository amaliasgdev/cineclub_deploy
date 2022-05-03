import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PeliculaService } from 'src/app/services/pelicula.service';
import { PublicacionService } from 'src/app/services/publicacion.service';
import { Publicacion } from 'src/interfaces/publicacion.interface';
import { getFecha } from '../../utils/fechas.js';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-resultado-busqueda-api',
  templateUrl: './resultado-busqueda-api.component.html',
  styleUrls: ['./resultado-busqueda-api.component.css']
})
export class ResultadoBusquedaApiComponent implements OnInit {

  titulo: any;
  arrBusqueda: any;
  imgUrl: String;
  paginaActual: any;
  numPaginas: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private peliculaService: PeliculaService,
    private publicacionService: PublicacionService) {
    this.arrBusqueda = [];
    this.imgUrl = 'https://image.tmdb.org/t/p/w500';
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.titulo = params['titulo'];
      this.peliculaService.search(this.titulo).then((result) => {
        this.paginaActual = result.page;
        this.numPaginas = result.total_pages;
        this.arrBusqueda = result.results;
      });
    });
  }

  async onClick(peliculaId: any, peliculaTitle: any) {
    let publicacion: Publicacion = {
      "peliculaId": peliculaId,
      "titulo": peliculaTitle
    };

    const response = await this.publicacionService.create(publicacion);

    if (response.affectedRows === 1) {
      Swal.fire(
        `Correcto`,
        `Pelicula publicada correctamente`,
        'success');
    } else (
      Swal.fire(
        `Correcto`,
        `Pelicula publicada correctamente`,
        'success')
    );
  }


  async cambiaPagina(siguiente: boolean) {
    if (siguiente) {
      this.paginaActual++;
    } else {
      this.paginaActual--;
    }
    //pido la pagina siguiente
    const response = await this.peliculaService.getByPage(this.titulo, this.paginaActual);
    this.arrBusqueda = response.results;
  }

  formatoFecha(fecha: any) {
    return getFecha(fecha);
  }

}



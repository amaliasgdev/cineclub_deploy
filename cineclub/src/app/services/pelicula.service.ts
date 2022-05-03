import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PeliculaService {

  apiKey: string;
  basicUrl: string;
  popularMovies: string;
  apiUrl: string;
  //imgUrl: string;
  urlBusqueda: string;

  constructor(private httpclient: HttpClient) {
    this.apiKey = 'api_key=951df19afa80b3aa811509981adcfbff';
    this.basicUrl = 'https://api.themoviedb.org/3';
    this.apiUrl = `${this.basicUrl}${this.popularMovies}&${this.apiKey}&language=es`;
  }

  getAll() {
    return firstValueFrom(
      this.httpclient.get<any>(this.apiUrl));
  }

  search(pFilm: string) {
    return firstValueFrom(
      this.httpclient.get<any>(`https://api.themoviedb.org/3/search/movie?api_key=951df19afa80b3aa811509981adcfbff&language=es&query=${pFilm}&page=1&include_adult=true`
      ));
  }

  getByPage(pFilm: string, pPage: number = 1) {
    return firstValueFrom(
      this.httpclient.get<any>(`https://api.themoviedb.org/3/search/movie?api_key=951df19afa80b3aa811509981adcfbff&language=es&query=${pFilm}&page=${pPage}&include_adult=true`
      ));
  }

  getById(pId: string) {
    return firstValueFrom(
      this.httpclient.get<any>(`https://api.themoviedb.org/3/movie/${pId}?api_key=951df19afa80b3aa811509981adcfbff&language=es`
      ));
  }

}

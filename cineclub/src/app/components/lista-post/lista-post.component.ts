import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PeliculaService } from 'src/app/services/pelicula.service';
import { PostService } from 'src/app/services/post.service';
import { PublicacionService } from 'src/app/services/publicacion.service';
import { ObservableUserService } from 'src/app/services/observable-user.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Modal } from 'bootstrap';
import { MensajeService } from 'src/app/services/mensaje.service';
import { getFecha } from '../../utils/fechas.js';
import { faStar, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-lista-post',
  templateUrl: './lista-post.component.html',
  styleUrls: ['./lista-post.component.css']
})
export class ListaPostComponent implements OnInit {

  formulario: FormGroup;
  formMensaje: FormGroup;
  peliculaId: any;
  arrPosts: any;
  pelicula: any;
  imgUrl: string;
  form: boolean;
  publicacionId: any;
  usuarioId: number;
  user: boolean;
  destinatarioId: number;
  destName: string;
  modal: Modal | undefined;
  mensaje: any;
  destinatario: any;
  imgImagenUrl: String;
  faStar: IconDefinition;
  rating: any;
  stars: number;


  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private publicacionService: PublicacionService,
    private peliculaService: PeliculaService,
    private usuarioService: UsuarioService,
    private observableUserService: ObservableUserService,
    private mensajeService: MensajeService,
    private router: Router) {
    this.arrPosts = [];
    this.imgUrl = 'https://image.tmdb.org/t/p/w500';
    this.form = false;
    this.user = false;
    //this.imgImagenUrl = 'http://localhost:3000/image/';
    this.imgImagenUrl = 'https://cineclub-back.herokuapp.com/image/';
    this.formulario = new FormGroup({
      titulo: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50)
      ]),
      texto: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(2500)
      ]),
      rating: new FormControl()
    });
    this.formMensaje = new FormGroup({
      titulo: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50)
      ]),
      mensaje: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ])
    });
    this.faStar = faStar;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.publicacionId = params["publicacionId"];
      this.recuperarPosts();
      this.getRating();
    });

    if (this.observableUserService.isLogged()) {
      const token = localStorage.getItem('token');
      this.usuarioService.getByToken(token).then(response => {
        //el usuarioId se necesita para mostrar o no el boton de envio de mensajes, para poder ocultarlo en caso de que se trate del mismo usuario. Si es el mismo usuario, en lugar del boton 'enviar mensaje' aparecerá la opcion de 'modificar'
        this.usuarioId = response.id;
        this.user = true;
      })
    }
  }

  async getRating() {
    let [response] = await this.publicacionService.getRating(this.publicacionId);
    this.rating = (response.rating * 2).toFixed(2);
    let ratingTruncate = Math.trunc(this.rating);
    this.stars = this.getStars(ratingTruncate);
  }

  //calcular estrellas rating
  getStars(pRating: number) {
    let stars;
    switch (pRating) {
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

  //comprobar si esta logeado para poder añadir un comentario
  async onClick() {
    let usuario: any;
    let token = localStorage.getItem('token');
    if (token !== null) {
      //saber si es admin o no      
      usuario = await this.usuarioService.getByToken(token);
      this.peliculaId = usuario.id;
      if (usuario.rol === 'user' || usuario.rol === 'admin') {
        this.form = !this.form;
      }
    } else {
      Swal.fire(
        'Error',
        `Necesita iniciar sesión para añadir comentarios`,
        'error'
      );
    }
  }

  //introducir un comentario/reseña
  async onSubmit() {
    //Relleno los datos del form que le faltan (publicacion)   
    let formulario = this.formulario.value;
    formulario.publicacionId = parseInt(this.publicacionId);
    //llamo a la funcion create      
    const respuesta = await this.postService.create(formulario);
    if (respuesta.affectedRows === 1) {
      this.form = !this.form;
      this.arrPosts = []
      this.recuperarPosts();
      Swal.fire(
        `Ok`,
        'Post introducido correctamente',
        'success');

    } else {
      Swal.fire(
        'Error',
        `${respuesta.error}`,
        'error'
      );
    }
  }

  async recuperarPosts() {
    //1. Se recupera el array de Posts de 1 publicacion por su ID
    this.arrPosts = await this.postService.getByPubId(this.publicacionId);
    //2. Se recupera la pelicula por el ID de la publicacion
    const [pelicula] = await this.publicacionService.getPeliculaId(this.publicacionId);
    //3. Se recupera el ID de la API externa de la pelicula a la que hace referencia la publicacion
    this.peliculaId = pelicula.pelicula_id;
    this.pelicula = await this.peliculaService.getById(this.peliculaId);

  }


  //funcion de envio de mensajes entre usuarios
  async onSubmitMensaje() {
    const envio = {
      "emisorId": this.usuarioId,
      "receptorId": this.destinatarioId,
      "titulo": this.formMensaje.value.titulo,
      "mensaje": this.formMensaje.value.mensaje
    }
    let response = await this.mensajeService.create(envio);
    if (response.affectedRows === 1) {
      this.formMensaje.reset();
      Swal.fire(
        `Correcto`,
        `Mensaje enviado a ${this.destName} correctamente`,
        'success');
    }
  }

  //abrir el modal para el envio de mensajes entre usuarios
  open(pUsername: string, pDestinatarioId: number) {
    this.destName = pUsername;
    this.destinatarioId = pDestinatarioId;
    const modalTest = document.getElementById('testModal');
    if (modalTest) {
      this.modal = new Modal(modalTest, {
        keyboard: false
      });
    }
    this.modal?.show();
  }

  formatoFecha(fecha: any) {
    return getFecha(fecha);
  }

  modificarPost() {
    this.router.navigate([`usuarios/posts`]);
  }

  //comprobar mensajes de error de los formularios
  checkErrors(control: string, error: string) {
    return this.formulario.get(control).hasError(error) && this.formulario.get(control).touched;
  }

  checkErrorsMessage(control: string, error: string) {
    return this.formMensaje.get(control).hasError(error) && this.formMensaje.get(control).touched;
  }

}









import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Modal } from 'bootstrap';
import { Post } from 'src/interfaces/post.interface';
import { getFecha } from '../../../utils/fechas.js';
import { PeliculaService } from 'src/app/services/pelicula.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  usuarioId: any;
  arrPost: any;
  numPost: number;
  hayPosts: boolean;
  destinatarioId: number;
  destName: string;
  formMensaje: FormGroup;
  modal: Modal | undefined;
  postId: number;
  imgUrl: string;

  constructor(
    private postService: PostService,
    private router: Router,
    private peliculaService: PeliculaService,
    private usuarioService: UsuarioService) {
    this.hayPosts = false;
    this.imgUrl = 'https://image.tmdb.org/t/p/w500';
  }

  async ngOnInit() {
    this.getPosts();
  }

  async getPosts() {
    let token = localStorage.getItem('token');
    let usuario = await this.usuarioService.getByToken(token);
    this.usuarioId = usuario.id;
    this.arrPost = await this.postService.getByUser(this.usuarioId);
    this.numPost = this.arrPost.length;
    if (this.numPost <= 0) {
      this.hayPosts = true;
    } else {
      for (let post of this.arrPost) {
        this.peliculaService.getById(post.pelicula_id).then(response => {
          //console.log('PELICULA', response)
          post.titulo = response.title;
          post.imagen = response.poster_path;
        })
      }
    }
  }

  async onClickBorrar(pPostId: number) {
    let response = await this.postService.deleteById(pPostId);
    if (response.affectedRows === 1) {
      Swal.fire(
        `Correcto`,
        `Post eliminado correctamente`,
        'success');
      this.arrPost = [];
      this.getPosts();
    }

  }

  async open(postId: number) {
    this.postId = postId;
    let [post] = await this.postService.getById(postId);
    this.createForm(post);
    const modalTest = document.getElementById('testModal');
    if (modalTest) {
      this.modal = new Modal(modalTest, {
        keyboard: false
      });
    }
    this.modal?.show();
  }

  async onSubmitModificacion() {
    console.log(this.formMensaje.value);
    let response = await this.postService.update(this.postId, this.formMensaje.value);
    if (response.affectedRows === 1) {
      Swal.fire(
        `Correcto`,
        `Post modificado correctamente`,
        'success');
      this.arrPost = [];
      this.getPosts();
    }
  }

  formatoFecha(fecha: any) {
    return getFecha(fecha);
  }

  onClickPost(pPublicacionId: any) {
    this.router.navigate(['/posts'], { queryParams: { publicacionId: pPublicacionId } });
  }

  createForm(post: Post) {
    this.formMensaje = new FormGroup({
      titulo: new FormControl(`${post.titulo}`, [
        Validators.required,
        Validators.minLength(5)
      ]),
      texto: new FormControl(post.texto, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(2500)
      ])
    });
  }

  checkErrorsMessage(control: string, error: string) {
    return this.formMensaje.get(control).hasError(error) && this.formMensaje.get(control).touched;
  }

}

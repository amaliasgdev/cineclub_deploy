import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajeService } from 'src/app/services/mensaje.service';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { getFecha } from '../../../utils/fechas.js';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes-recibidos.component.html',
  styleUrls: ['./mensajes-recibidos.component.css']
})
export class MensajesRecibidosComponent implements OnInit {

  usuarioId: any;
  arrMensajes: any;
  numMensajes: number;
  hayMensajes: boolean;
  formMensaje: FormGroup;
  destinatarioId: number;
  destName: string;
  modal: Modal | undefined;
  imgImagenUrl: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private mensajeService: MensajeService,
    private usuarioService: UsuarioService,
    private router: Router) {
    this.hayMensajes = false;
    //this.imgImagenUrl = 'http://localhost:3000/image/';
    this.imgImagenUrl = 'https://cineclub-back.herokuapp.com/image/';
    this.formMensaje = new FormGroup({
      titulo: new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ]),
      mensaje: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(2500)
      ])
    });
  }

  async ngOnInit() {
    this.getMensajes();
  }

  async getMensajes() {
    this.arrMensajes = await this.mensajeService.getRecibidosByUserId();
    this.arrMensajes.forEach(mensaje => {
      mensaje.boolean = false;
    });
    for (let mensaje of this.arrMensajes) {
      let [usuario] = await this.usuarioService.getUserById(mensaje.emisor_id);
      mensaje.imagen = usuario.imagen;
    }
    this.numMensajes = this.arrMensajes.length;
    if (this.numMensajes <= 0) {
      this.hayMensajes = true;
    }

  }

  onClickLeer(indice: number) {
    this.arrMensajes[indice].boolean = !this.arrMensajes[indice].boolean;
  }

  checkErrorsMessage(control: string, error: string) {
    return this.formMensaje.get(control).hasError(error) && this.formMensaje.get(control).touched;
  }

  open(pDestinatarioId: number, destName: string) {
    this.destName = destName;
    this.destinatarioId = pDestinatarioId;
    console.log(this.destinatarioId)
    console.log(this.destName)
    const modalTest = document.getElementById('testModal');
    if (modalTest) {
      this.modal = new Modal(modalTest, {
        keyboard: false
      });
    }
    this.modal?.show();
  }

  onSubmitMensaje() {
    const envio = {
      "emisorId": this.arrMensajes[0].receptor_id,
      "receptorId": this.destinatarioId,
      "titulo": this.formMensaje.value.titulo,
      "mensaje": this.formMensaje.value.mensaje
    }
    console.log(envio);
    this.mensajeService.create(envio)
      .then(response => {
        if (response.affectedRows > 0) {
          this.formMensaje.reset();
          Swal.fire(
            `Correcto`,
            `Mensaje enviado a ${this.destName} correctamente`,
            'success');
        }
      }).catch(error => {
        console.log(error)
      })
  }

  async onClickBorrar(mensajeId: number) {
    let response = await this.mensajeService.deleteById(mensajeId);
    if (response.affectedRows === 1) {
      Swal.fire(
        `Correcto`,
        `Mensaje eliminado correctamente`,
        'success');
    } else {
      Swal.fire(
        `Error`,
        `El mensaje no ha podido eliminarse`,
        'error');
    }
    this.arrMensajes = [];
    this.numMensajes = 0;
    this.getMensajes();
  }

  formatoFecha(fecha: any) {
    return getFecha(fecha);
  }

}

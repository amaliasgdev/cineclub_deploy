import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {

  formulario: FormGroup;

  constructor(private router: Router) {
    this.formulario = new FormGroup({
      titulo: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    let titulo = (this.formulario.value.titulo);
    this.router.navigate(['/searchapi'], { queryParams: { titulo: titulo } });
  }

}

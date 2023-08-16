import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CepService } from '../shared/cep.service';
import { exhaustAll } from 'rxjs';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
  providers: [CepService],
})
export class DataFormComponent {
  formulario: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private cepService: CepService) {
    // this.formulario = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null),
    //   endereco: new FormGroup({
    //      cep: new FormControl(null),
    //   })
    // });

    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required]],
        numero: [null, [Validators.required]],
        complemento: [null],
        rua: [null, [Validators.required]],
        bairro: [null, [Validators.required]],
        cidade: [null, [Validators.required]],
        estado: [null, [Validators.required]],
      }),
    });

    console.log(this.formulario);
  }

  fieldIsValid(campo: string): boolean {
    return this.formulario.get(campo)! && this.formulario.get(campo)!.touched;
  }

  onSubmit() {
    console.log(this.formulario.value);

    this.http.post('servidor/form', JSON.stringify(this.formulario.value)).subscribe(dados => {
      console.log(dados);
      this.resetar();
    }, (error: any) => alert(error));
  }

  resetar() {
    this.formulario.reset();
  }

  consultaCep() {
    this.cepService.consultaCep(this.formulario.get(["endereco", "cep"])?.value, this.popularFormulario);
  }

  popularFormulario(dados: any): void {
    console.log(dados);
    
    // this.formulario.patchValue({
    //   endereco: {
    //     cep: dados.cep,
    //     complemento: dados.complemento,
    //     rua: dados.logradouro,
    //     bairro: dados.bairro,
    //     cidade: dados.localidade,
    //     estado: dados.uf,
    //   },
    // });
  }
}

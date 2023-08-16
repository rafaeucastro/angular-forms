import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError } from 'rxjs';
import { CepService } from '../shared/cep.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css'],
  providers: [CepService],
})
export class TemplateFormComponent {
  usuario: any = {
    nome: 'Ghost Reckon',
    email: 'ghost@email.com',
    password: 'GhostPass',
  };

  constructor(private http: HttpClient, private cepService: CepService) { }

  onSubmit(f: any) {
    console.log(f);

    this.http.post('servidor/form', JSON.stringify(f.value)).subscribe(dados => console.log(dados));
  }

  fieldIsValid(f: any): boolean {
    return !f.valid && f.touched;
  }

  consultaCep(cep: any, form: any) {
    this.cepService.consultaCep(cep, (data) => this.popularFormulario(data, form));
  }

  popularFormulario(dados: any, ngForm: any) {
    console.log(dados);
    // ngForm.setValue({
    //   nome: ngForm.value.nome,
    //   email: ngForm.value.email,
    //   endereco: {
    //     cep: dados.cep,
    //     numero: '',
    //     complemento: dados.complemento,
    //     rua: dados.logradouro,
    //     bairro: dados.bairro,
    //     cidade: dados.localidade,
    //     estado: dados.uf,
    //   },
    // });

     ngForm.form.patchValue({
      endereco: {
        cep: dados.cep,
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      },
    });
  }

  resetarDadosForm() {

  }
}

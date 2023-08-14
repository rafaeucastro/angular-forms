import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent {
  usuario: any = {
    nome: 'Ghost Reckon',
    email: 'ghost@email.com',
    password: 'GhostPass',
  };

  constructor(private http: HttpClient) { }

  onSubmit(f: any) {
    console.log(f);
  }

  fieldIsValid(f: any): boolean {
    return !f.valid && f.touched;
  }

  consultaCep(cep: any, form: any) {
    console.log(cep);
    cep.replace(RegExp("\/D/g"), '');

    if (cep != "") {
      var validaCep = RegExp('\^[0-9]{8}\$');
      if (validaCep.test(cep)) {
        const url = `https://viacep.com.br/ws/${cep}/json`;
        const options = {
          responseType: 'json' as const,
          observe: 'response' as const
        };
        this.http.get(url, options).subscribe((response => this.popularFormulario(response.body, form)));
      }
    }
  }

  popularFormulario(dados: any, form: any) {
    console.log(dados);

    form.setValue({
      nome: 'null',
      email: null,
      endereco: {
        cep: dados.cep,
        numero: '',
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      },
    });
  }
}

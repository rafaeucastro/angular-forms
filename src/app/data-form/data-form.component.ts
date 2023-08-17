import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CepService } from '../shared/cep.service';

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
    let input = this.formulario.get([campo]);
    
    if(campo != 'nome' && campo != 'email') {
      input = this.formulario.get(['endereco', campo])
    };
    return input!.valid && (input!.touched || input!.dirty);
  }

  onSubmit() {
    if(this.formulario.valid) {
      this.http.post('servidor/form', JSON.stringify(this.formulario.value)).subscribe(dados => {
        console.log(dados);
        this.resetar();
      }, (error: any) => alert(error));
    } else {
      console.log('Formulário inválido');
      this.verificarValidacoesForm(this.formulario);
    }
  }

  verificarValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle?.markAsUntouched();

      if(controle instanceof FormGroup) {
        this.verificarValidacoesForm(controle);
      }
    });
  }

  resetar() {
    this.formulario.reset();
  }

  consultaCep() {
    let cep: string = this.formulario.get(["endereco", "cep"])?.value;
    this.cepService.consultaCep(cep, (dados) => this.popularFormulario(dados));
  }

  popularFormulario(dados: any): void {
    console.log(dados);
    
    this.formulario.patchValue({
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
}

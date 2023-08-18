import { EstadoBR } from './../shared/models/estado-br';
import { DropdownService } from './../shared/dropdown.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CepService } from '../shared/cep.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
  providers: [CepService],
})
export class DataFormComponent implements OnInit {
  //estados: EstadoBR[] = [];
  estados: Observable<EstadoBR[]> = new Observable();
  cargos: any[] = [];
  tecnologias: any[] = [];
  formulario: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private cepService: CepService,
    private dropdownService: DropdownService,
    ) {
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
      cargo: [null],
      tecnologias: [null],
    });

    console.log(this.formulario);
  }

  ngOnInit(): void {
    this.estados = this.dropdownService.getEstados() as Observable<EstadoBR[]>;
    this.cargos = this.dropdownService.cargos;
    this.tecnologias = this.dropdownService.tecnologias;

    // this.dropdownService.getEstados().subscribe(response => {
    //   this.estados = response as EstadoBR[];
    //   console.log(this.estados);
    // });
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

  setCargo(){
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'DevPl'};
    this.formulario.patchValue({cargo: cargo});
  }

  compararCargos(objeto1: any, objeto2: any): boolean {
    return objeto1 && objeto2 ? (objeto1.nome === objeto2.nome && objeto1.nivel === objeto2.nivel) : objeto1 === objeto2;
  }

  setTecnologias() {
    const tecnologias = ['ruby',  'javascript'];
    this.formulario.get('tecnologias')?.setValue(tecnologias);
  }
}

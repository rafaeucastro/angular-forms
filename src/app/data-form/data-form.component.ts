import { EstadoBR } from './../shared/models/estado-br';
import { DropdownService } from './../shared/dropdown.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormRecord, Validators } from '@angular/forms';
import { CepService } from '../shared/cep.service';
import { Observable } from 'rxjs';
import { FormValidation } from '../shared/form-validations';

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
  newsletter: any[] = [];
  frameworks: string[] = ['Angular', 'React', 'Vue', 'Sencha'];
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
      confirmEmail: [null, [Validators.required, Validators.email, FormValidation.equalsTo('email')]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidation.cepValidator]],
        numero: [null, [Validators.required]],
        complemento: [null],
        rua: [null, [Validators.required]],
        bairro: [null, [Validators.required]],
        cidade: [null, [Validators.required]],
        estado: [null, [Validators.required]],
      }),
      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      termos: [null, Validators.requiredTrue],
      frameworks: this.buildFrameworks(),

    });

    console.log(this.formulario);
  }

  buildFrameworks() {
    const values = this.frameworks.map(framework => new FormControl(false));
    
    return this.formBuilder.array(values);
  }

  ngOnInit(): void {
    this.estados = this.dropdownService.getEstados() as Observable<EstadoBR[]>;
    this.cargos = this.dropdownService.cargos;
    this.tecnologias = this.dropdownService.tecnologias;
    this.newsletter = this.dropdownService.newsletter;

    // this.dropdownService.getEstados().subscribe(response => {
    //   this.estados = response as EstadoBR[];
    //   console.log(this.estados);
    // });
  }

  fieldIsValid(campo: string): boolean {
    let input = this.formulario.get([campo]);
    let camposSimples = ['nome', 'email', 'termos'];
    
    if(!camposSimples.includes(campo)){
      input = this.formulario.get(['endereco', campo])
    };
    return !(input?.hasError('required') && (input!.touched || input!.dirty));
  }

  onSubmit() {
    let valueSubmit = Object.assign({}, this.formulario.value);
    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((_checked: boolean, index: number) => _checked ?  this.frameworks[index] : null)
        .filter((v: any) => v != null),
    });

    console.log(valueSubmit);

    if(this.formulario.valid) {
      this.http.post('servidor/form', JSON.stringify(valueSubmit)).subscribe(dados => {
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
        //cep: dados.cep,
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

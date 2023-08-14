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

  onSubmit(f: any){
    console.log(f);
  }

  fieldIsValid(f: any): boolean {
    return !f.valid && f.touched;
  }
}

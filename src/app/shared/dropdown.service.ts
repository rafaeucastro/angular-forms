import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DropdownService {
  constructor(private http: HttpClient) { }

  public getEstados() {
    return this.http.get('assets/estadosbr.json', {observe: 'body'});
  }

  get cargos() {
    return [
      { nome: 'Dev', nivel: 'Júnior', desc: 'DevJr'},
      { nome: 'Dev', nivel: 'Pleno', desc: 'DevPl'},
      { nome: 'Dev', nivel: 'Sênior', desc: 'DevSr'},
    ];
  }

  get tecnologias() {
    return [
      {nome: 'java', desc: 'Java'},
      {nome: 'javascript', desc: 'JavaScript'},
      {nome: 'php', desc: 'PHP'},
      {nome: 'ruby', desc: 'Ruby'},
    ];
  }

  get newsletter() {
    return [
      {valor: 's', desc: 'Sim'},
      {valor: 'n', desc: 'Não'},
    ];
  }
}

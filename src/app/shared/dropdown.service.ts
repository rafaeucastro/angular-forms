import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DropdownService {
  constructor(private http: HttpClient) { }

  public getEstados() {
    return this.http.get('assets/estadosbr.json', {observe: 'body'});
  }
}

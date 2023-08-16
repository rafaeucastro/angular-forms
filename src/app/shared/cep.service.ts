import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CepService {
    constructor(private http: HttpClient){}

    consultaCep(cep: string, callback: (value : Object) => void) {
        cep.replace(RegExp("\/D/g"), '');
    
        if (cep != "") {
          var validaCep = RegExp('\^[0-9]{8}\$');
    
          if (validaCep.test(cep)) {
            const url = `https://viacep.com.br/ws/${cep}/json`;
            const options = {
              responseType: 'json' as const,
              observe: 'response' as const
            };
            this.http.get(url, options).subscribe((response) => callback(response.body!));
          }
        }
    }
}
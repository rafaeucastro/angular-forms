import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VerificarEmailService {

  constructor(private http: HttpClient) { }

  verificarEmail(email: string) {
    return this.http.get('assets/verificarEmail.json')
      .pipe(
        delay(2000),
        map((data: any) => data.emails),
        //tap(console.log)
        map((emails: {email: string}[]) => emails.filter(v => v.email === email)),
        //tap(console.log)
        map((dados: any[]) => dados.length > 0),
        //tap(console.log)
    );
  }
}

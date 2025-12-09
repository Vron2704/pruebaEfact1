import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  // Usamos el prefijo del proxy para evitar CORS
  private baseUrl = '/api-efact-ose';

  // Datos del PDF [cite: 18, 20, 22]
  private defaultUser = '20111193035';
  private defaultPass = '61a77b6fda77c3a2d6b28930546c86d7f749ccf0bd4bad1e1192f13bb59f0f30';
  public ticket = '571cc3a3-5b1f-4855-af26-0de6e7c5475f';

  login(username: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/oauth/token`;

    // El PDF indica x-www-form-urlencoded [cite: 30]
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password);

    // El PDF muestra este header Basic en el curl [cite: 29]
    // "Y2xpZW50OnNLY3JldA==" es "client:secret" en base64
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2xpZW50OnNlY3JldA==',
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(url, body.toString(), { headers });
  }

  // Método genérico para obtener archivos (PDF, XML, CDR) [cite: 38]
  getDocument(type: 'pdf' | 'xml' | 'cdr', token: string): Observable<Blob> {
    const url = `${this.baseUrl}/v1/${type}/${this.ticket}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // [cite: 37]
    });

    // Pedimos 'blob' para poder manejar archivos binarios (PDF) y texto
    return this.http.get(url, { headers, responseType: 'blob' });
  }
}
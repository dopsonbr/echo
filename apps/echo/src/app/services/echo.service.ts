import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EchoRequest {
  text: string;
}

export interface EchoResponse {
  echo: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class EchoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  echo(text: string): Observable<EchoResponse> {
    const request: EchoRequest = { text };
    return this.http.post<EchoResponse>(`${this.apiUrl}/echo`, request);
  }
} 
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpService {

  private baseUrl = 'https://sendnotificationfirebase-production.up.railway.app';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/user/login`, { email, password });
  }

  sendNotification(token: string, fcmToken: string, title: string, body: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.post(`${this.baseUrl}/notifications/`, {
      token: fcmToken,
      notification: { title, body },
      android: { priority: 'high', data: {} }
    }, { headers });
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private backendUrl = 'http://localhost:3000/api/contacts';
  constructor(private http: HttpClient) { }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.backendUrl);
  }
}

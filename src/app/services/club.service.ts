import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClubItemData } from '../models/club-item-data';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:5000/clubs';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  save(club: ClubItemData) {
    return this.http.post(`${baseUrl}`, club);
  }

  delete(clubId: string) {
    return this.http.delete(`${baseUrl}/${clubId}`);
  }

  constructor(private http: HttpClient) { }

  getAll():Observable<any>{
    return this.http.get(baseUrl);
  }
}

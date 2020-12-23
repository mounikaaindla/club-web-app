import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MemberItemData } from '../models/member-item-data';
import { LoggerService } from './logger.service';

const BASE_URL='http://localhost:5000/clubs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http: HttpClient, private logger: LoggerService) { }

  delete(memberId: string, clubId: string): Observable<any>{
    return this.http.delete(`${BASE_URL}/${clubId}/members/${memberId}`);
  }

  save(member: MemberItemData, clubId: string): Observable<any>{
    return this.http.post(`${BASE_URL}/${clubId}/members`, member);
  }
}

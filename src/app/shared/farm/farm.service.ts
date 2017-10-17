import { Injectable } from '@angular/core';
import {Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class FarmService {

  constructor(private http: Http) { }

  getAll(): Observable<any> {
    // external use ip
    // http://192.168.1.65:8080/farms
    return this.http.get('http://localhost:8080/farms').map(
      (response: Response) => response.json()
    );
  }
}

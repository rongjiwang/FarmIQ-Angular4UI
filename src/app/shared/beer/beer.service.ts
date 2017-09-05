import { Injectable } from '@angular/core';
import {Http,Response} from '@angular/http';
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";

@Injectable()
export class BeerService {

  constructor(private http: Http) { }

  getAll(): Observable<any> {
    return this.http.get('http://localhost:8080/goodbeers').map(
      (response: Response) => response.json()
    );
  }
}

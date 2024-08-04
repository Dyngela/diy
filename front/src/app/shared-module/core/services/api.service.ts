import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {environment} from "../../../environment/environment";

export interface ParamsUrl {
  name: string;
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  constructor(private http: HttpClient,
  ) {}

  get(path: string, params ?: ParamsUrl[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })

    let p = new HttpParams();
    if (params) {
      params.forEach(criterion => {
        p = p.append(criterion.name, criterion.value);
      });
    }

    return this.http
      .get(`${environment.baseUrl}${path}`,
        {
          headers: headers,
          params: p,
        }).pipe(catchError(this.formatErrors))
  }

  put(path: string, body: Object = {}): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http
      .put(
        `${environment.baseUrl}${path}`,
        JSON.stringify(body),
        {
          headers: headers,
        }).pipe(catchError(this.formatErrors))
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post(
        `${environment.baseUrl}${path}`,
        JSON.stringify(body),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).pipe(catchError(this.formatErrors))
  }

  delete(path: string): Observable<any> {
    return this.http
      .delete(`${environment.baseUrl}${path}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }).pipe(catchError(this.formatErrors))
  }

  postFile(fileToUpload: File, path: string): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http
      .post(`${environment.baseUrl}${path}`, formData, {
        headers: {
          enctype: 'multipart/form-data',
        },
        responseType: 'text',
      }).pipe(catchError(this.formatErrors));
  }

  putFile(path: string, body: Object = {}, file: any[]): Observable<any> {
    const mData = JSON.stringify(body);
    const formData = new FormData();
    formData.append('data', mData);
    if (file.length > 0) {
      for (let i=0; i < file.length; i++) {
        formData.append(String(i), file[i], file[i].name)
      }
    }
    return this.http.put(`${environment.baseUrl}${path}`, formData, {
      headers: {
      }
    })
  }

  downloadFile(path: string, arg?: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}${path}`, arg, {
      headers: {
      },
      responseType: "text"
    });
  }

  downloadZip(path: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}${path}`, {
      headers: {
      },
      responseType: "arraybuffer"
    });
  }
}

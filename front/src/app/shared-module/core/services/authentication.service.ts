import {inject, Injectable} from '@angular/core';
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiService = inject(ApiService)

  public login(email: string, password: string, tenant: string) {
    return this.apiService.post('connect/login', {email, password, societe: tenant});
  }
}

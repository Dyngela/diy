import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {JWT} from "../DTO/jwtDto";
import {ApiService} from "./api.service";
import {CookieService} from "ngx-cookie-service";
import {CurrentUser} from "../DTO/currentUser";

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  currentUser$ = new BehaviorSubject<CurrentUser | undefined>(undefined);

  constructor(private api: ApiService, private cookieService: CookieService) { }

  setCurrentUser(needRefresh: boolean = true) {
    let jwt = new JWT()
    jwt.accessToken = this.getBearer()
    jwt.refreshToken= this.getRefresh()

    if (!needRefresh) {
      const decodedJWT = JSON.parse(window.atob(jwt.accessToken.split('.')[1]))
      const currentUser: CurrentUser = {
        email: decodedJWT.email,
        access: decodedJWT.access,
        tenant: decodedJWT.tenant,
        expireAt: decodedJWT.expireAt,
        roles: decodedJWT.roles
      };
      this.currentUser$.next(currentUser)
      return
    }

    this.renewToken(jwt).subscribe({
      next: value => {
        const decodedJWT = JSON.parse(window.atob(value.accessToken.split('.')[1]))
        const currentUser: CurrentUser = {
          email: decodedJWT.email,
          access: decodedJWT.access,
          tenant: decodedJWT.tenant,
          expireAt: decodedJWT.expireAt,
          roles: decodedJWT.roles
        };
        this.currentUser$.next(currentUser)
      },
      error: err => {
        this.currentUser$.next(undefined)
        this.logout()
      }
    })
  }

  // TODO create the endpoint lol
  renewToken(tokenApi : JWT){
    return this.api.post(`connect/refresh`, tokenApi)
  }

  storeTokensAndRefreshToken(bearer: string, refresh: string) {
    const expiresIn = 7; // number of days the cookie will be stored
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + expiresIn);
    this.cookieService.set('diy-jwt-token', bearer, expiresDate, '/', undefined, true, 'Strict');
    this.cookieService.set('diy-refresh-token', refresh, expiresDate, '/', undefined, true, 'Strict');

    this.setCurrentUser(false)
  }

  storeBearerToken(bearer: string) {
    const expiresIn = 7; // number of days the cookie will be stored
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + expiresIn);
    this.cookieService.set('diy-jwt-token', bearer, expiresDate, '/', undefined, true, 'Strict');
  }

  getBearer(): string {
    const bearer = this.cookieService.get("diy-jwt-token")
    if (bearer) {
      return bearer
    }
    return ""
  }

  getRefresh(): string {
    const bearer = this.cookieService.get("diy-refresh-token")
    if (bearer) {
      return bearer
    }
    return ""
  }

  logout() {
    this.cookieService.delete("diy-jwt-token")
    this.currentUser$.next(undefined);
  }
}

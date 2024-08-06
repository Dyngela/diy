import {ApplicationConfig, importProvidersFrom, inject, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, Router} from '@angular/router';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  provideHttpClient, withInterceptors,
} from "@angular/common/http";
import {ConfirmationService, MessageService} from "primeng/api";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {CurrentUserService} from "./shared-module/core/services/current-user.service";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {JWT} from "./shared-module/core/DTO/jwtDto";

function handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandlerFn, token: string): Observable<HttpEvent<any>> {
  const auth = inject(CurrentUserService);
  let jwt = new JWT();
  jwt.accessToken = token
  jwt.refreshToken = auth.getRefresh()!;
  return auth.renewToken(jwt)
    .pipe(
      switchMap((data: JWT)=>{
        auth.storeBearerToken(data.accessToken);
        req = req.clone({
          setHeaders: {Authorization:`Bearer ${data.accessToken}`}  // "Bearer "+myToken
        })
        return next(req);
      }),
      catchError((err)=>{
        return throwError(()=>{
          console.log("jsp c'est relou: ", err)
        })
      })
    )
}

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next:
  HttpHandlerFn) => {
  const auth = inject(CurrentUserService);
  const router = inject(Router);
  const myToken = auth.getBearer();
  if(myToken){
    req = req.clone({
      setHeaders: {Authorization:`Bearer ${myToken}`}  // "Bearer "+myToken
    })
  }
  return next(req).pipe(
    catchError((err:any)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          console.log("Unauthorized")
          return handleUnAuthorizedError(req, next, myToken);
        }
        if (err.status === 403){
          console.log("Forbidden")
          router.navigate(['connexion'])
        }
      }
      return throwError(()=> err)
    })
  );
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    MessageService,
    ConfirmationService,
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([jwtInterceptor]),),
  ]
};



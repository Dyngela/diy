import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import {catchError, Observable, switchMap, tap, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {JWT} from "../DTO/jwtDto";
import {CurrentUserService} from "./current-user.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: CurrentUserService, private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const myToken = this.auth.getBearer();
    if(myToken){
      request = request.clone({
        setHeaders: {Authorization:`Bearer ${myToken}`}  // "Bearer "+myToken
      })
    }

    return next.handle(request).pipe(
      catchError((err:any)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            return this.handleUnAuthorizedError(request,next);
          }
          if (err.status === 403){
            this.router.navigate(['connexion'])
          }
        }
        return throwError(()=> err)
      })
    );
  }

  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler){
    let jwt = new JWT();
    jwt.accessToken = this.auth.getBearer()!;
    jwt.refreshToken = this.auth.getRefresh()!;
    return this.auth.renewToken(jwt)
      .pipe(
        switchMap((data: JWT)=>{
          this.auth.storeBearerToken(data.accessToken);
          req = req.clone({
            setHeaders: {Authorization:`Bearer ${data.accessToken}`}  // "Bearer "+myToken
          })
          return next.handle(req);
        }),
        catchError((err)=>{
          return throwError(()=>{
            console.log("jsp c'est relou: ", err)
          })
        })
      )
  }

}

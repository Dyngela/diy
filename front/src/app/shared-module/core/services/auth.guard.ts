import {inject} from '@angular/core';
import {CanActivateFn, Router} from "@angular/router";
import {filter, map} from "rxjs";
import {CurrentUserService} from "./current-user.service";

export const isConnectedGuard: CanActivateFn = () => {
  const currentUserService = inject(CurrentUserService)
  const router = inject(Router)

  return currentUserService.currentUser$.pipe(
    filter((currentUser) => currentUser !== undefined),
    map((currentUser) => {
      if (!currentUser) {
        router.navigateByUrl('/connect/login');
        return false;
      }
      return true
    })
  );
}



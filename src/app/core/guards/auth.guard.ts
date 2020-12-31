import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Inject, Injectable} from '@angular/core';
import {AuthService} from '@core/services/auth.service';
import {TokenService} from '@core/services/token.service';
import {environment} from '../../../environments/environment';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.tokenService.getToken()) {
      return true;
    }
    this.document.location.href = this.authService.oauth2URL;
    return false;
  }
}

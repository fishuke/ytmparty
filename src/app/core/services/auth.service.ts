import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {ApiService} from '@core/services/api.service';
import {TokenService} from '@core/services/token.service';
import {Router} from '@angular/router';
import {User} from '@shared/interfaces';
import {SnackbarService} from '@core/services/snackbar.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class AuthService {
  private userStateSubject: BehaviorSubject<User>;
  public userState$: Observable<User>;

  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  public oauth2URL = `https://id.twitch.tv/oauth2/authorize?client_id=${environment.CLIENT_ID}&redirect_uri=${environment.ORIGIN}/login&response_type=token&scope=user_read+chat:read`;

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
    private router: Router,
    private snack: SnackbarService,
    private api: ApiService
  ) {
    this.userStateSubject = new BehaviorSubject(null);
    this.userState$ = this.userStateSubject.asObservable().pipe(distinctUntilChanged());

    this.isLoggedInSubject = new BehaviorSubject(false);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable().pipe(distinctUntilChanged());

  }


  public get userState(): User {
    return this.userStateSubject.value;
  }

  public get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  async loginPromise(): Promise<void> {
    await new Promise((resolve, reject) => {
      this.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn === true) {
          resolve();
        }
      });
    });
  }


  check(): void {
    const token = this.tokenService.getToken();

    if (token) {
      this.apiService.get('kraken/user')
        .toPromise()
        .then(response => {
          this.set(response);
          console.log(response);
        })
        .catch(() => this.purge());
    } else {
      this.purge();
    }
  }


  set(user): void {
    this.userStateSubject.next(user);
    this.isLoggedInSubject.next(true);
  }

  purge(): void {
    this.tokenService.destroyToken();
    this.userStateSubject.next(null);
    this.isLoggedInSubject.next(false);
    // this.router.navigate(['/']).then(() => this.snack.default('Successfully logged out.'));
  }

  logout(): void {
    this.purge();
    this.router.navigate(['/']).then(() => this.snack.default('Logged out successfully.'));
  }

  async login(token: string): Promise<any> {
    this.tokenService.saveToken(token);
    this.check();
  }


}

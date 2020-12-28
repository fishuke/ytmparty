import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {AuthService} from '../../core/services/auth.service';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document,
              private route: ActivatedRoute,
              private auth: AuthService) {

  }

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const params = fragment.split('&');
        if (params[0] && params[1] && params[2]) {
          const token = params[0].slice(13);
          const scopes = params[1].slice(6);
          const tokenType = params[2].slice(11);
          console.log({
            token, scopes, tokenType
          });
          if (scopes !== 'user_read+chat:read') {
            this.redirectToHome();
          }
          if (tokenType !== 'bearer') {
            this.redirectToHome();
          }
          if (token){
            this.auth.login(token);
          }
        } else {
          this.redirectToHome();
        }
      } else {
        this.redirectToHome();
      }
    });

  }

  redirectToHome(): void {
    this.document.location.href = environment.ORIGIN;
  }
}

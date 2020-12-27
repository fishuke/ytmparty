import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../core/services/auth.service';


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
    this.route.fragment.toPromise().then(fragment => {
      console.log(fragment);
    });
    // this.route.queryParams
    //   .subscribe(params => {
    //       // if (params.code) {
    //       //   this.auth.login(params.code);
    //       // } else {
    //       //   this.document.location.href = environment.DISCORD_OAUTH2_URL;
    //       // }
    //     }
    //   );
  }
}

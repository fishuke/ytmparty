import {Component} from '@angular/core';
import {AuthService} from '@core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public auth: AuthService) {
  }

}

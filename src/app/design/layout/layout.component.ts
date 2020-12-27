import {Component, OnInit} from '@angular/core';
import {AuthService} from '@core/services/auth.service';
import {BreakpointService} from '@core/services/breakpoint.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(public authService: AuthService,
              public breakpointService: BreakpointService) {

  }

  ngOnInit(): void {
    this.authService.check();
  }
}

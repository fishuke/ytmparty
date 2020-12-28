import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import * as tmi from 'tmi.js';
import {TokenService} from '../../core/services/token.service';
import {Message} from '../../shared/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  messageArray: Message[] = [];

  constructor(private auth: AuthService, private token: TokenService) {
  }

  ngOnInit(): void {
    this.bootstrap();
  }

  async bootstrap(): Promise<void> {
    await this.auth.loginPromise();
    const client = new tmi.Client({
      connection: {
        secure: true,
        reconnect: true
      },
      identity: {
        username: this.auth.userState.name,
        password: `oauth:${this.token.getToken()}`
      },
      channels: [this.auth.userState.name]
    });
    client.connect().catch(console.error);
    client.on('message', (channel, tags, message, self) => {
      console.log(tags);
      this.messageArray.push({
        content: message,
        author: tags['display-name'],
        color: tags.color
      });
    });
  }

}

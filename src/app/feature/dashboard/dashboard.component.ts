import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import * as tmi from 'tmi.js';
import {TokenService} from '../../core/services/token.service';
import {Message} from '../../shared/interfaces';
import * as moment from 'moment';
import * as _ from 'lodash';
import { last } from 'rxjs/operators';

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
    const client = tmi.Client({
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

    // Adds
    client.on('message', (channel, tags, message, self) => {

      let isSentBefore = false;
      const idx = _.findIndex(this.messageArray, { content: message });
      if (idx > -1) isSentBefore = true;

      if (isSentBefore) {
        const lastMessage = this.messageArray[idx];
    
        this.messageArray.push({
          content: message,
          author: tags['display-name'],
          color: tags.color,
          createdAt: moment().unix(),
          repeatCount: lastMessage.repeatCount+1
        });

        this.messageArray.splice(idx, 1);
      } else {
        this.messageArray.push({
          content: message,
          author: tags['display-name'],
          color: tags.color,
          createdAt: moment().unix(),
          repeatCount: 1
        });
      }
    });
  }

}

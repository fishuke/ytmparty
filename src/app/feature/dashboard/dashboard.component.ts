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

  compareMessage(first: string, second: string): boolean {
    first = first.replace(/\s+/g, "");
    second = second.replace(/\s+/g, "");

    if (!first.length && !second.length) return true;
    if (!first.length || !second.length) return false;
    if (first === second) return true;
    if (first.length === 1 && second.length === 1) return false;
    if (first.length < 2 || second.length < 2) return false;

    const letters = new Map();
    let intersectionSize = 0;

    for (let i = 0; i < first.length - 1; i++) {
      const letter = first.substring(i, i + 2);
      const count = letters.has(letter)
        ? letters.get(letter) + 1
        : 1;

      letters.set(letter, count);
    };

    for (let i = 0; i < second.length - 1; i++) {
      const letter = second.substring(i, i + 2);
      const count = letters.has(letter)
        ? letters.get(letter)
        : 0;

      if (count > 0) {
        letters.set(letter, count - 1);
        intersectionSize++;
      }
    }

    const percent = (2.0 * intersectionSize) / (first.length + second.length - 2);
    return percent >= .5;
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
      const idx = _.findIndex(this.messageArray, ({content}) => {
        return this.compareMessage(content, message);
      });
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

  function similar(a,b) {
    var equivalency = 0;
    var minLength = (a.length > b.length) ? b.length : a.length;    
    var maxLength = (a.length < b.length) ? b.length : a.length;    
    for(var i = 0; i < minLength; i++) {
        if(a[i] == b[i]) {
            equivalency++;
        }
    }

    var weight = equivalency / maxLength;
    return (weight * 100);
  }

}

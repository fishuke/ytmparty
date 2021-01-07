import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public partyCode;
  public response;
  public error;

  constructor() {}

  async onCreatePartyButtonClick(): Promise<void> {
    if (!await this.checkIfCurrentTabIsCorrect()) {
      return;
    }
    await chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {msg: 'createParty'}, response => {
        this.response = response.msg;
      });
    });
  }

  async onJoinPartyButtonClick(): Promise<void> {
    if (!await this.checkIfCurrentTabIsCorrect()) {
      return;
    }
    await chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {msg: 'joinParty', partyCode: this.partyCode}, response => {
        this.response = response.msg;
      });
    });
  }
223
  async checkIfCurrentTabIsCorrect(): Promise<boolean> {
    let isCurrentTabIsCorrect: boolean;
    await chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
      if (!tabs[0].url.includes('https://music.youtube.com')) {
        this.error = 'This extension is only usable in youtube music.';
        isCurrentTabIsCorrect = false;
      } else {
        isCurrentTabIsCorrect = true;
      }
    });
    return isCurrentTabIsCorrect;
  }

}

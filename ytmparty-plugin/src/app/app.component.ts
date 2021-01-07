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



  constructor() {
  }

  async onCreatePartyButtonClick(): Promise<void> {
    if (!await this.checkIfCurrentTabIsCorrect) {
      return;
    }
    await chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {msg: 'createParty'}, response => {
        this.response = response.msg;
      });
    });
  }

  async onJoinPartyButtonClick(): Promise<void> {
    if (!await this.checkIfCurrentTabIsCorrect) {
      return;
    }
    await chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {msg: 'joinParty', partyCode: this.partyCode}, response => {
        this.response = response.msg;
      });
    });
  }

}

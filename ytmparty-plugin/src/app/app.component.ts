import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public partyCode = new FormControl('', [Validators.maxLength(8), Validators.minLength(8)]);
  public isInParty;
  public joinedPartyCode;
  public response;
  private extensionId = 'oononiaicnkfdebjkpfabepkggkneeep';

  constructor() {
  }

  ngOnInit(): void {
    chrome.runtime.sendMessage(this.extensionId, {event: 'isInParty'},
      response => {
        this.isInParty = response;
        if (response) {
          this.getPartyCode();
        }
      });
    setTimeout(() => {
      chrome.runtime.sendMessage(this.extensionId, {event: 'isInParty'},
        response => {
          this.isInParty = response;
          if (response) {
            this.getPartyCode();
          }
        });
    }, 50);
  }

  async onJoinPartyButtonClick(): Promise<void> {
    chrome.runtime.sendMessage(this.extensionId, {event: 'joinParty', partyCode: this.partyCode.value},
      response => {
        console.log(response);
      });
  }

  async onCreatePartyButtonClick(): Promise<void> {
    chrome.runtime.sendMessage(this.extensionId, {event: 'createParty'},
      response => {
        console.log(response);
      });
  }

  async onLeavePartyButtonClick(): Promise<void> {
    chrome.runtime.sendMessage(this.extensionId, {event: 'leaveParty'},
      response => {
        console.log(response);
      });
  }

  getPartyCode(): void {
    chrome.runtime.sendMessage(this.extensionId, {event: 'getPartyCode'},
      response => {
        console.log(response);
        this.joinedPartyCode = response;
      });
  }

}

import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {SnackbarService} from './services/snackbar.service';

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
  private extensionId = chrome.runtime.id;

  constructor(private snack: SnackbarService) {
  }

  ngOnInit(): void {
    this.checkParty();
    this.listenMessages();
  }

  async onJoinPartyButtonClick(): Promise<void> {
    setTimeout(() => {
      this.checkParty();
    }, 100);
    chrome.runtime.sendMessage(this.extensionId, {event: 'joinParty', code: this.partyCode.value});
  }

  async onCreatePartyButtonClick(): Promise<void> {
    chrome.runtime.sendMessage(this.extensionId, {event: 'createParty'});
    setTimeout(() => {
      this.checkParty();
    }, 100);
    setTimeout(() => {
      this.checkParty();
    }, 250);
    setTimeout(() => {
      this.checkParty();
    }, 500);
  }

  async onLeavePartyButtonClick(): Promise<void> {
    chrome.runtime.sendMessage(this.extensionId, {event: 'leaveParty'});
    this.isInParty = false;
  }

  listenMessages(): void {
    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        if (request) {
          if (request.event === 'joinedRoom') {

            this.joinedPartyCode = request.code;
            this.isInParty = true;
            this.checkParty();
          } else if (request.event === 'error') {
            this.snack.error(request.error);
            this.isInParty = false;
          }
        }
        sendResponse(true);

      });
  }

  getPartyCode(): void {
    chrome.runtime.sendMessage(this.extensionId, {event: 'getPartyCode'},
      response => {
        this.joinedPartyCode = response;
      });
  }

  private checkParty(): void {
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
    }, 100);
  }
}

import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public joinedPartyCode;
  public response;
  public error;
  public value;
  private editorExtensionId = 'oononiaicnkfdebjkpfabepkggkneeep';

  constructor() {
  }

  async onJoinPartyButtonClick(): Promise<void> {
    chrome.runtime.sendMessage(this.editorExtensionId, {event: 'joinParty', partyCode: this.value},
      response => {
        response.response('test');
        console.log(response);
      });
  }

  async onCreatePartyButtonClick(): Promise<void> {
    chrome.runtime.sendMessage(this.editorExtensionId, {event: 'createParty'},
      response => {
        response.response('test');
        console.log(response);
      });
  }

}

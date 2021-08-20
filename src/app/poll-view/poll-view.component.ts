import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Poll } from '../shared/models/poll';
import { PollService } from '../shared/services/poll.service';

@Component({
  selector: 'app-poll-view',
  templateUrl: './poll-view.component.html',
  styleUrls: ['./poll-view.component.scss']
})
export class PollViewComponent implements OnInit {
  activePoll:Poll;
  userAnswer;
  
  constructor(private pollService: PollService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.pollService.events$.forEach(event => {
      switch (event) {
        case "PollCreated":
        case "PollUpdated":
          this.initPolling();
          break;
        case "Reset":
          this.resetPolling();
          break;
        default:
          break;
      };
    });
  }

  initPolling(){
    this.activePoll = this.pollService.get();
  }

  resetPolling(){
    this.activePoll = undefined;
  }

  CastVote(){
    this.pollService.castVote(this.userAnswer);
    this.userAnswer = "";
    this._snackBar.open("Thank you for your vote.","Ok",{
      duration: 3000
    });
  }

}

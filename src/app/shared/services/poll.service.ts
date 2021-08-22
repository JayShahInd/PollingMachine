import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Poll } from '../models/poll';
import { Vote } from '../models/votes';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  private _subject = new Subject<any>();
  private _activePoll: Poll;
  private _votes: Vote[] = [];
  constructor() { }

  get() {
    return this._activePoll;
  }

  getResult() {
    return this._votes;
  }

  post(poll: Poll) {
    this._activePoll = poll;
    this._activePoll.options.forEach(item => {
      var tempItem = JSON.parse(JSON.stringify(item));
      this._votes.push({
        answer: tempItem.Value,
        key: tempItem.Key,
        count: 0
      });
    });
    this.newEvent('PollCreated');
  }

  put(poll: Poll) {
    
    this._activePoll = poll;

    this._activePoll.options.forEach(item => {
      var tempItem = JSON.parse(JSON.stringify(item));
      var voteItemIndex = this._votes.findIndex(item => item.key === tempItem.Key);
      if (voteItemIndex > -1) {
        this._votes[voteItemIndex].answer = tempItem.Value;;
      }
      else {
        this._votes.push({
          answer: tempItem.Value,
          key: tempItem.Key,
          count: 0
        });
      }
    });

    var itemsToDelete = [];
    var itemFound = false;
    this._votes.forEach(item => {
      itemFound = false;
      this._activePoll.options.forEach(itemA => {
        var tempItem = JSON.parse(JSON.stringify(itemA));
        if (tempItem.Key == item.key) {
          itemFound = true;
        }
      });
      if (!itemFound) {
        itemsToDelete.push(item.key);
      }
    });

    itemsToDelete.forEach(item => {
      var voteItemIndex = this._votes.findIndex(c => c.key === item);
      this._votes.splice(voteItemIndex,1);
    });

    this.newEvent('PollUpdated');
  }

  delete() {
    this._activePoll = undefined;
    this._votes = [];
    this.newEvent('Reset');
  }

  castVote(vote) {
    var voteItemIndex = this._votes.findIndex(item => item.key === vote);
    var voteAnswer;
    if (voteItemIndex > -1) {
      this._votes[voteItemIndex].count = this._votes[voteItemIndex].count + 1;
    }
    else {
      this._activePoll.options.forEach(item => {
        var tempItem = JSON.parse(JSON.stringify(item));
        if (tempItem.Key == vote) {
          voteAnswer = tempItem.Value;
        }
      });
      this._votes.push({
        answer: voteAnswer,
        count: 1,
        key: vote
      });
    }
    this.newEvent('VoteCasted');
  }

  newEvent(event) {
    this._subject.next(event);
  }

  get events$() {
    return this._subject.asObservable();
  }

}

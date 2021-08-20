import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Guid } from 'guid-typescript';
import { environment } from 'src/environments/environment';
import { PollOptions } from '../shared/models/poll-options';
import { PollService } from '../shared/services/poll.service';

@Component({
  selector: 'app-poll-create',
  templateUrl: './poll-create.component.html',
  styleUrls: ['./poll-create.component.scss']
})
export class PollCreateComponent implements OnInit {

  @ViewChild('myForm') myForm: NgForm;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  pollForm: FormGroup;
  maxPollOptions = environment.maxPollOptions;
  minPollOptions = environment.minPollOptions;
  maxCharLength = environment.maxCharLength;
  minPollOpionError = false;
  formSubmitted = false;
  setForEdit = false;

  constructor(private formBuilder: FormBuilder, private pollService: PollService, private _snackBar: MatSnackBar) { }
  
  ngOnInit(): void {
    this.initPollForm();
  }

  get PollControls() {
    return this.pollForm.controls;
  }

  private initPollForm() {
    var poll = this.pollService.get();
    if (!poll) {
      poll = { topic: "", options: [] }
    }
    this.pollForm = this.formBuilder.group(
      {
        Topic: [poll.topic],
        Options: this.formBuilder.array([])
      });

    if (poll.options.length > 0) {
      poll.options.forEach(element => {
        var tempItem = JSON.parse(JSON.stringify(element));
        this.pollForm.controls.Options['controls'].push(this.addPollItem({ key: tempItem.Key, value: tempItem.Value }));
      });
    }
    else {
      this.pollForm.controls.Options['controls'].push(this.addPollItem({ key: Guid.create().toString(), value: "" }));
    }
  }

  savePoll() {
    var options: PollOptions[] = [];
    var count = 0;
    this.minPollOpionError = false;
    this.pollForm.controls.Options['controls'].forEach(element => {
      if (element.value.Value) {
        element.value.Key = Guid.create().toString();
        options.push(element.value);
        count = count + 1;
      }
    });

    if (count >= this.minPollOptions) {

      this.pollService.post({
        topic: this.PollControls.Topic.value,
        options: options
      });

      this._snackBar.open("Poll created successfully.", "Ok", {
        duration: 3000
      });

      this.setForEdit = true;
      this.formSubmitted = true;

      this.initPollForm();
    }
    else {
      this.minPollOpionError = true;
    }


  }

  updatePoll() {
    var options: PollOptions[] = [];
    var count = 0;
    this.minPollOpionError = false;
    this.pollForm.controls.Options['controls'].forEach(element => {
      if (element.value.Value) {
        if(!element.value.Key){
          element.value.Key = Guid.create().toString();
        }
        options.push(element.value);
        count = count + 1;
      }
    });

    if (count >= this.minPollOptions) {

      this.pollService.put({
        topic: this.PollControls.Topic.value,
        options: options
      });

      this._snackBar.open("Poll updated successfully.", "Ok", {
        duration: 3000
      });

      this.setForEdit = true;
    }
    else {
      this.minPollOpionError = true;
    }
  }

  addPollOption() {
    this.pollForm.controls.Options['controls'].push(this.addPollItem({ key: Guid.create().toString(), value: "" }));
  }

  removePollOption(item) {
    this.pollForm.controls.Options['controls'].splice(item, 1);
  }

  addPollItem(item?: PollOptions): FormGroup {
    return this.formBuilder.group({
      Value: [item.value],
      Key: [item.key]
    });
  }

  resetPoll() {
    this.pollService.delete();
    this.pollForm.controls.Options['controls'].splice(1);
    this.pollForm.reset();
    this.myForm.resetForm();
    this.formGroupDirective.resetForm();
    this.pollForm.updateValueAndValidity();
    this.minPollOpionError = false;
    this.setForEdit = false;
  }



}

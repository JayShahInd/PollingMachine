import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PollCreateComponent } from './poll-create.component';
import { FormGroup, FormControl, FormBuilder, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { Poll } from '../shared/models/poll';
import { Vote } from '../shared/models/Votes';
import { PollService } from '../shared/services/poll.service';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Overlay } from '@angular/cdk/overlay';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PollOptions } from '../shared/models/poll-options';
const vote: Vote[] = [{
   count: 2,
   key: 1,
   answer: '1'
},
{
   count: 3,
   key: 2,
   answer: '2'
}];

const activePoll: Poll = {
   options: [{ key: '1', value: 'test' }, { key: '2', value: 'test2' }],
   topic: ''
};

const _subject = new Subject<any>();
_subject.next('PollCreated');
const pollServiceStub = {
   events$: _subject,
   getResult: jasmine.createSpy('getResult').and.returnValue(vote),
   get: jasmine.createSpy('get').and.returnValue(activePoll),
   put: jasmine.createSpy('put').and.returnValue({}),
   post: jasmine.createSpy('post').and.returnValue({}),
   delete: jasmine.createSpy('delete').and.returnValue({}),
};

describe('PollCreateComponent', () => {
   let component: PollCreateComponent;
   let fixture: ComponentFixture<PollCreateComponent>;
   const formBuilder: FormBuilder = new FormBuilder();
   function createForm() {
      component.pollForm = formBuilder.group({
         Topic: 'test1',
         Options: formBuilder.array([{ key: '1', Value: 'test1' }, { key: '2', Value: 'test2' }]),
      });
   }
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [PollCreateComponent],
         imports: [ReactiveFormsModule, FormsModule, BrowserDynamicTestingModule, BrowserAnimationsModule],
         providers: [{ provide: PollService, useValue: pollServiceStub },
            { provide: FormBuilder, useValue: formBuilder }, MatSnackBar, Overlay],
         schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(PollCreateComponent);
      component = fixture.componentInstance;
      createForm();
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });

   it('should initiate form', () => {
      component.minPollOptions = 0;
      component.updatePoll();
      expect(component.setForEdit).toBe(true);
   });

   it('should save poll', () => {
      component.minPollOptions = 0;
      component.savePoll();
      expect(component.setForEdit).toBe(true);
   });

   it('should delete poll', () => {
      component.resetPoll();
      expect(component.setForEdit).toBe(false);
   });

   it('should add poll item', () => {
      const item: PollOptions = { key: '2', value: 'test2' };
      const output = component.addPollItem(item);
      expect(output.value.Value).toBe('test2');
   });

   it('should add poll item', () => {
      component.addPollOption();
      expect(component.pollForm.controls.Options['controls'].length).toBe(3);
   });

   it('should add poll item', () => {
      const item: PollOptions = { key: '2', value: 'test2' };
      component.removePollOption(item);
      expect(component.pollForm.controls.Options['controls'].length).toBe(1);
   });

   it('should initiate form for mininum value', () => {
      component.minPollOptions = 1;
      component.pollForm = formBuilder.group({
         Topic: 'test1',
         Options: formBuilder.array([]),
      });
      component.updatePoll();
      expect(component.minPollOpionError).toBe(true);
   });

});

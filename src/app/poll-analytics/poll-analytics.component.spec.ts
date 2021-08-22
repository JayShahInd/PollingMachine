import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PollAnalyticsComponent } from './poll-analytics.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { Vote } from '../shared/models/Votes';
import { PollService } from '../shared/services/poll.service';
import { Subject } from 'rxjs/internal/Subject';
import { Poll } from '../shared/models/poll';

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
   get: jasmine.createSpy('get').and.returnValue(activePoll)
};

describe('PollAnalyticsComponent', () => {
   let component: PollAnalyticsComponent;
   let fixture: ComponentFixture<PollAnalyticsComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [PollAnalyticsComponent],
         providers: [{ provide: PollService, useValue: pollServiceStub }],
         schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(PollAnalyticsComponent);
      component = fixture.componentInstance;
      component.barChartData = [
         { data: [0, 1], label: 'Answers' },
      ];
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });

   it('should initiate poll chart', () => {
      component.pollData = [];
      component.initPollChart();
      expect(component.pieChartData[0]).toEqual(0);
   });

   it('should update poll chart', () => {
      component.pollData = [];
      component.updatePollChart();
      expect(component.barChartLabels[0]).toEqual('1');
   });

   it('should resetChart', () => {
      component.resetChart();
      expect(component.pollData.length).toEqual(0);
   });

   it('should reset data from component', () => {
      component.resetChart();
      expect(component.barChartData[0].data.length).toEqual(0);
   });

});
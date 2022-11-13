import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns';
import { Observable } from 'rxjs';
import { TasksService } from 'src/app/services/tasks.service';

import { Task } from '../../../models/task.model';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-tasks-calender',
  templateUrl: './tasks-calender.component.html',
  styleUrls: ['./tasks-calender.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksCalenderComponent implements OnInit {
  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events$: Observable<CalendarEvent<{ task: Task }>[]>;

  activeDayIsOpen: boolean = false;

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.fetchEvents();
    // this.events$.subscribe((d) => console.log(d));
  }

  fetchEvents(): void {
    this.events$ = this.tasksService.getAllTasks().pipe(
      map((tasks: Task[]) => {
        return tasks.map((task: Task) => {
          return {
            title: task.title,
            start: new Date(task.start_at),
            color: colors.yellow,
            allDay: true,
            meta: {
              task,
            },
          };
        });
      })
    );
  }

  dayClicked({
    date,
    events,
  }: {
    date: Date;
    events: CalendarEvent<{ task: Task }>[];
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event: CalendarEvent<{ task: Task }>): void {}
}

import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import {
  CalendarEvent,
  CalendarView,
  CalendarEventAction,
} from 'angular-calendar';
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
import { WindowRef } from 'src/app/services/window.service';

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

  @Output() taskSelected = new EventEmitter<number>();

  actions: CalendarEventAction[] = [
    {
      label:
        '<span class="calendar-edit" style="display: inline-block; margin-right: 5px;">edit</span>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        console.log(event);
        this.taskSelected.emit(event.meta.task.id);
        this.windowRef.nativeWindow.scrollTo(0, 0);
        this.activeDayIsOpen = false;
      },
    },
    {
      label:
        '<span class="calendar-edit" style="display: inline-block; margin-right: 5px;">delete</span>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.tasksService.deleteTask(event.meta.task.id).subscribe(() => {
          this.activeDayIsOpen = false;
          this.tasksService.getAllTasks();
          this._snackBar.open('Task deleted successfully', 'Dismiss');
        });
      },
    },
  ];

  constructor(
    private _snackBar: MatSnackBar,
    private tasksService: TasksService,
    private windowRef: WindowRef
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
    this.events$ = this.tasksService.tasksChanged.pipe(
      map((tasks: Task[]) => {
        return tasks.map((task: Task) => {
          return {
            title: task.title,
            start: new Date(task.start_at),
            color: colors.yellow,
            actions: this.actions,
            allDay: true,
            meta: {
              task,
            },
          };
        });
      })
    );
  }

  fetchEvents(): void {
    this.events$ = this.tasksService.getAllTasks().pipe(
      map((tasks: Task[]) => {
        return tasks.map((task: Task) => {
          return {
            title: task.title,
            start: new Date(task.start_at),
            color: colors.yellow,
            actions: this.actions,
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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Task } from 'src/app/models/task.model';
import { TasksService } from 'src/app/services/tasks.service';
import { WindowRef } from 'src/app/services/window.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  @Output() taskSelected = new EventEmitter<number>();

  constructor(
    public tasksService: TasksService,
    private windowRef: WindowRef
  ) {}

  ngOnInit(): void {
    this.tasksService.getAllTasks();
    this.tasksService.tasksChanged.subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  onEditTask(taskId) {
    this.taskSelected.emit(taskId);
    this.windowRef.nativeWindow.scrollTo(0, 0);
  }

  onDeleteTask(taskId) {
    this.tasksService.deleteTask(taskId).subscribe(() => {
      this.tasksService.getAllTasks();
    });
  }
}

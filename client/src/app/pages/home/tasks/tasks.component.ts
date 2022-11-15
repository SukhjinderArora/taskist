import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Task } from 'src/app/models/task.model';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  @Output() taskSelected = new EventEmitter<number>();

  constructor(public tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasksService.getAllTasks();
    this.tasksService.tasksChanged.subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  onEditTask(taskId) {
    this.taskSelected.emit(taskId);
  }

  onDeleteTask(taskId) {
    this.tasksService.deleteTask(taskId);
  }
}

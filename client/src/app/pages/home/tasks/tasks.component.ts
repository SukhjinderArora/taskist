import { Component, OnInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  tasks: Task[];
  constructor(public tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasksService.getAllTasks();
  }
}

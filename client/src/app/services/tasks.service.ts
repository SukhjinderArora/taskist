import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly _tasks = new BehaviorSubject<Task[]>([]);

  readonly tasks$ = this._tasks.asObservable();

  constructor(private http: HttpClient) {}

  get tasks(): Task[] {
    return this._tasks.getValue();
  }

  private set tasks(val: Task[]) {
    this._tasks.next(val);
  }

  addTask(task: Task) {
    this.tasks = [...this.tasks, { ...task }];
  }

  removeTask(id: number) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  getAllTasks() {
    const tasksObservable = this.http.get<Task[]>('/api/tasks/all');
    tasksObservable.subscribe((tasks) => {
      this.tasks = tasks;
    });
    return tasksObservable;
  }

  createNewTask(title: string, description: string, date: Date) {
    return this.http
      .post<Task>('/api/tasks/new', {
        title,
        description,
        startDate: new Date(date).toISOString(),
      })
      .subscribe((task) => {
        console.log(task);
        this.addTask(task);
      });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  tasksChanged = new Subject<Task[]>();

  private tasks: Task[];

  constructor(private http: HttpClient) {}

  getAllTasks() {
    const tasksObservable = this.http.get<Task[]>('/api/tasks/all');
    tasksObservable.subscribe((tasks) => {
      this.tasks = tasks;
      this.tasksChanged.next([...this.tasks]);
    });
    return tasksObservable;
  }

  getTask(taskId: number): Task {
    return this.tasks.find((task) => task.id === taskId);
  }

  createNewTask(title: string, description: string, date: Date) {
    return this.http.post<Task>('/api/tasks/new', {
      title,
      description,
      startDate: new Date(date).toISOString(),
    });
  }

  updateTask(title: string, description: string, date: Date, taskId: number) {
    return this.http.put<Task>(`/api/tasks/${taskId}/update`, {
      title,
      description,
      startDate: new Date(date).toISOString(),
    });
  }

  deleteTask(taskId: number) {
    return this.http.delete(`/api/tasks/${taskId}/delete`);
  }

  syncEventsAndTasks() {
    return this.http.get<Task>('/api/tasks/sync');
  }
}

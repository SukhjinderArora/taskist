import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.taskForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      startDate: new FormControl(new Date(), [Validators.required]),
    });
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this.tasksService.createNewTask(
        form.value.title,
        form.value.description,
        form.value.startDate
      );
      form.reset();
      this.formDirective.resetForm();
    }
  }
}

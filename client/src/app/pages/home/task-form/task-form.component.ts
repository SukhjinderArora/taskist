import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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
export class TaskFormComponent implements OnInit, OnChanges {
  taskForm: FormGroup;
  editMode: boolean = false;
  @Input() taskId: number | null;
  @Output() formSubmitted = new EventEmitter<void>();
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    private tasksService: TasksService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.editMode = !!this.taskId;
    this.renderForm();
  }

  private renderForm() {
    console.log('render', this.editMode);
    let title = '';
    let description = '';
    let startDate = new Date();
    if (this.editMode) {
      const task = this.tasksService.getTask(this.taskId);
      console.log(task);
      title = task.title;
      description = task.description;
      startDate = new Date(task.start_at);
    }
    this.taskForm = new FormGroup({
      title: new FormControl(title, [Validators.required]),
      description: new FormControl(description, [Validators.required]),
      startDate: new FormControl(startDate, [Validators.required]),
    });
  }

  ngOnChanges(): void {
    console.log(this.taskId);
    this.editMode = !!this.taskId;
    this.renderForm();
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      if (this.editMode) {
        this.tasksService
          .updateTask(
            form.value.title,
            form.value.description,
            form.value.startDate,
            this.taskId
          )
          .subscribe(() => {
            this.editMode = false;
            this.formSubmitted.emit();
            this.tasksService.getAllTasks();
          });
      } else {
        this.tasksService
          .createNewTask(
            form.value.title,
            form.value.description,
            form.value.startDate
          )
          .subscribe(() => {
            this.tasksService.getAllTasks();
          });
      }
      form.reset();
      this.formDirective.resetForm();
    }
  }
}

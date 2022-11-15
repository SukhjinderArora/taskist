import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selectedTaskId: number | null;
  constructor() {}

  ngOnInit(): void {}

  onTaskSelected(taskId: number) {
    this.selectedTaskId = taskId;
  }

  onFormSubmit() {
    this.selectedTaskId = null;
  }
}

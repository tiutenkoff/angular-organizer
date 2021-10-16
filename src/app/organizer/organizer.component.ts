import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { DateService } from '../shared/date.service';
import { TaskService, Task } from '../shared/tasks.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  form: FormGroup;
  tasks: Task[] = [];

  constructor(
    public dateService: DateService,
    public taskService: TaskService
  ) {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  submit() {
    const { title } = this.form.value;

    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    }
    this.taskService.create(task).subscribe(val => {
      this.tasks.push(task);
      this.form.reset();
    });

  }
  
  remove(task: Task) {
    this.taskService.remove(task).subscribe(tasks => {
      this.tasks = this.tasks.filter(currTask => currTask !== task);
    });
  }

  ngOnInit(): void {
    this.dateService.date
      .pipe(
        switchMap(value => this.taskService.load(value))
      )
      .subscribe(tasks => {
        this.tasks = tasks;
      })
  }

}

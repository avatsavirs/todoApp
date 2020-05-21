import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { TodoListItem } from '../../models/TodoListItem.model'
import { TasksService } from 'src/app/services/tasks.service';
@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  addTaskForm: FormGroup;
  task: TodoListItem;
  constructor(private tasksService: TasksService) { }

  ngOnInit(): void {
    this.addTaskForm = new FormGroup({
      title: new FormControl(null,
        [
          Validators.required,
          Validators.maxLength(100)
        ]),
      label: new FormControl(null,
        [
          Validators.required,
          Validators.maxLength(100)
        ]),
      priority: new FormControl(0,
        [
          Validators.required,
        ])
    });
  }
  onSubmit() {
    if (this.addTaskForm.status === 'INVALID') {
      console.error('Form Invalid');
    } else if (this.addTaskForm.status === 'VALID') {
      const newTask: TodoListItem = {
        ...this.addTaskForm.value,
        created_on: Date.now(),
        is_completed: false
      }
      this.tasksService.addTask(newTask)
      this.addTaskForm.reset(
        {priority: 0}
      )
    }
  }
}

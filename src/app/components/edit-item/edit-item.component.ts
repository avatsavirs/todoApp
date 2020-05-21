import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { TodoListItem } from '../../models/TodoListItem.model'
import { TasksService } from 'src/app/services/tasks.service';
@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {

  @Input() task: TodoListItem;
  @Input() index: number;
  editTaskForm: FormGroup;
  constructor(private tasksService: TasksService) { }

  ngOnInit(): void {

    this.editTaskForm = new FormGroup({
      title: new FormControl(this.task.title,
        [
          Validators.required,
          Validators.maxLength(100)
        ]),
      label: new FormControl(this.task.label,
        [
          Validators.required,
          Validators.maxLength(100)
        ]),
      priority: new FormControl(this.task.priority,
        [
          Validators.required,
        ])
    });
  }
  onSubmit() {
    if (this.editTaskForm.valid) {
      const editedTask = {
        ...this.task,
        ...this.editTaskForm.value
      }
      this.tasksService.updateTask(editedTask, this.index);
    } else {
      console.error('Invalid Input');
    }
  }
}

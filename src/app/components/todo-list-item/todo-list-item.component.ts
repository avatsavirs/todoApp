import { Component, OnInit, Input } from '@angular/core';
import { TodoListItem } from '../../models/TodoListItem.model';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.css']
})
export class TodoListItemComponent implements OnInit {

  @Input() todoListItem: TodoListItem;
  @Input() index: number;
  isLoading = false;
  priority: string;

  constructor(private tasksService: TasksService) { }

  ngOnInit(): void { 
    this.tasksService.isLoading.subscribe(index => {
      if (this.index === index) {
        this.isLoading  = true;
      }
    });
  }
  onDelete() {
    this.tasksService.deleteTask(this.todoListItem);
  }
  onComplete() {
    this.tasksService.markComplete(this.todoListItem);
  }
}

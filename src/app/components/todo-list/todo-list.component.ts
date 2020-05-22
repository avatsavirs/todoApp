import { Component, OnInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { TodoListItem } from 'src/app/models/TodoListItem.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  constructor(private taskService: TasksService) { }
  isLoading = true;
  tasks: TodoListItem[];
  ngOnInit(): void {
    this.taskService.fetchData();
    this.taskService.isLoading.subscribe(val => {
      if (val === -1){
        this.isLoading = true;
      }
    });
    this.taskService.listUpdated.subscribe(list => {
      this.tasks = list;
      console.log(this.tasks);
      this.isLoading = false;
    });
  }

}

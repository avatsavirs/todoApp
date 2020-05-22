import { Injectable } from '@angular/core';
import { TodoListItem } from '../models/TodoListItem.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class TasksService {

  todoList: TodoListItem[] = [];
  listUpdated = new Subject<TodoListItem[]>();
  isLoading = new Subject<number>();

  constructor(private http: HttpClient) { }

  addTask(newTask: TodoListItem) {
    this.isLoading.next(-1);
    this.http.post('https://todo-application-a7a5c.firebaseio.com/tasks.json', newTask)
      .subscribe(
        response => {
          newTask._id = response['name'];
          this.todoList.push(newTask);
          this.listUpdated.next(this.todoList.slice());
        }
      )
  }

  fetchData() {
    this.http.get<TodoListItem[]>('https://todo-application-a7a5c.firebaseio.com/tasks.json')
      .pipe(map(tasks => {
        if (tasks) {
          tasks = Object.keys(tasks).map(i => {
            return { ...tasks[i], _id: i }
          })
        } else {
          tasks = [];
        }
        return tasks;
      }))
      .subscribe(
        tasks => {
          this.todoList = tasks;
          this.listUpdated.next(this.todoList.slice());
        }
      )
  }

  deleteTask(_id: string, index: number) {
    // this.todoList.splice(index, 1);
    // this.listUpdated.next(this.todoList.slice());
    this.http.delete(`https://todo-application-a7a5c.firebaseio.com/tasks/${_id}.json`)
      .subscribe(
        () => {
          this.todoList.splice(index, 1);
          this.listUpdated.next(this.todoList.slice());
        });
  }

  markComplete(_id: string, index: number) {
    this.http.patch(`https://todo-application-a7a5c.firebaseio.com/tasks/${_id}.json`, {
      is_completed: true,
      completed_date: Date.now()
    })
      .subscribe(result => {
        console.log(result);
      })
  }

  updateTask(editedTask: TodoListItem, index: number) {
    this.isLoading.next(index);
    this.http.put(`https://todo-application-a7a5c.firebaseio.com/tasks/${editedTask._id}.json`, { ...editedTask })
      .subscribe(
        result => {
          this.todoList[index] = editedTask;
          this.listUpdated.next(this.todoList.slice());
        });
  }
}

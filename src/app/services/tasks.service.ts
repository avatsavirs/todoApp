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

  deleteTask(task: TodoListItem) {
    const index = this.todoList.indexOf(task);
    this.todoList.splice(index, 1);
    this.listUpdated.next(this.todoList.slice());
    this.http.delete(`https://todo-application-a7a5c.firebaseio.com/tasks/${task._id}.json`)
      .subscribe(
        /* () => {
          this.todoList.splice(index, 1);
          this.listUpdated.next(this.todoList.slice());
        } */);
  }

  markComplete(task: TodoListItem) {
    const index = this.todoList.indexOf(task);
    this.http.patch(`https://todo-application-a7a5c.firebaseio.com/tasks/${task._id}.json`, {
      is_completed: true,
      completed_on: Date.now()
    })
      .subscribe(result => {
        this.todoList[index].is_completed = result['is_completed'];
        this.todoList[index].completed_on = result['completed_on'];
      })
  }

  updateTask(task: TodoListItem, editedTask: TodoListItem) {
    const index = this.todoList.indexOf(task);
    this.isLoading.next(index);
    editedTask._id = undefined;
    this.http.put(`https://todo-application-a7a5c.firebaseio.com/tasks/${task._id}.json`, { ...editedTask })
      .subscribe(
        result => {
          this.todoList[index] = {...editedTask, _id: task._id};
          this.listUpdated.next(this.todoList.slice());
          // console.log(this.todoList);
        });
  }
}

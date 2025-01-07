import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map} from 'rxjs';
import { Task } from "../models/task";
import { HttpService } from './http.service';
import { HttpErrorResponse } from '@angular/common/http'
import { Subtask } from '../models/subtask';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private tasks = new BehaviorSubject<Task[]>([])
  
  private redirectToLoginPage = new Subject<boolean>()
  _redirectToLoginPage = this.redirectToLoginPage.asObservable()
  
  constructor(
    private http: HttpService
  ) { }

  filter: string = 'all'

  editTaskId: number = -1

  get length(): number {
    return this.tasks.value.length
  }


  loadTasks(): void {
    this.http.tasks()
      .subscribe(
        (tasks) => this.tasks.next(tasks),
        (error) => this.handleError(error)
      )
  }


  getTasks(): Observable<Task[]> {
    return this.tasks.asObservable()
      .pipe(
        map(task => { 
          if (this.filter === 'all') return task
          if (this.filter === 'done') return task.filter(task => task.done)
          if (this.filter === 'notDone') return task.filter(task => !task.done)
        })
      )
  }


  addTask(task: Partial<Task>) {
    this.http.addTask(task)
      .subscribe(
        () => this.loadTasks(),
        (error) => this.handleError(error)
      )
  }


  updateTask = (task: Partial<Task>) => 
    new Promise<boolean>(resolve => { 
      this.http.updateTask(task)
        .subscribe(
          () => resolve(true),
          () => resolve(false)
        )
      })


  deleteTask(taskId: number) { 
    this.http.deleteTask(taskId).subscribe(
      () => this.loadTasks(),
      (error) => this.handleError(error)
    )
  }

  
  deleteAll = () =>
    new Promise<boolean>(resolve => { 
      this.http.deleteAll().subscribe(
        () => resolve(true),
        () => resolve(false)
      )
    })
  
  
  deleteAllDone = () =>
    new Promise<boolean>(resolve => { 
      this.http.deleteAllDone().subscribe(
        () => resolve(true),
        () => resolve(false)
      )
    })

  
  markAsDone = (i: number, done: boolean) =>
    new Promise<boolean>(resolve => {
      this.http.markAsDone(i, done).subscribe(
        () => resolve(true),
        () => resolve(false)
      )
    })
  
  
  markAsImportant = (i: number, important: boolean) =>
    new Promise<boolean>(resolve => {
      this.http.markAsImportant(i, important).subscribe(
        () => resolve(true),
        () => resolve(false)
      )
    })


  updateSubtasks = (i: number, subtasks: String) =>
    new Promise<boolean>(resolve => { 
        this.http.updateSubtasks(i, subtasks).subscribe(
        () => resolve(true),
        () => resolve(false)
      )
    })

  
  reorder(tasks: Task[]) { 
    this.http.reorder(tasks).subscribe(
      () => this.loadTasks(),
      (error) => this.handleError(error)
    )
  }


  private handleError(error: HttpErrorResponse) {
    if (error.status === 403 || error.status === 401) { 
      this.redirectToLoginPage.next(null)
    }
    else console.error(error)
  }

}

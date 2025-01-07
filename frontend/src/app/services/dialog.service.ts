import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, catchError} from 'rxjs';
import { TasksService } from './tasks.service';


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private text = new BehaviorSubject<string>('Czy na pewno chcesz usunąć?!');
  
  private active = new BehaviorSubject<boolean>(false)
  private hide = new BehaviorSubject<boolean>(false)

  private taskToDeleteIds: number[]

  constructor(private tasksService: TasksService) { }


  getText(): Observable<string> {
    return this.text.asObservable();
  }


  setText(_text: string): void {
    this.text.next(_text)
  }


  isActive(): Observable<boolean> {
    return this.active.asObservable()
  }

  isHide(): Observable<boolean> {
    return this.hide.asObservable()
  }


  open(): boolean {
    if (this.active.getValue()) {
      return false
    } else { 
      this.active.next(true)
      return true
    }
  }


  close(): boolean {
    if (this.active.getValue()) {
      this.hide.next(true)
      setTimeout(() => { 
        this.active.next(false)
        this.hide.next(false)
      },200)
      return true
    } else { 
      return false
    }
  }


  confirm(): void {
    this.taskToDeleteIds.forEach(id => {
      this.tasksService.deleteTask(id)
    })
    this.close()
  }

  
  setTaskToDeleteIds(ids: number[]): void {
    this.taskToDeleteIds = ids
  }
}

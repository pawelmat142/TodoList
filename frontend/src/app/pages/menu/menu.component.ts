import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';
import { TasksService } from 'src/app/services/tasks.service';
import { BehaviorSubject, Observable, Subject, map} from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Output() closeEvent = new EventEmitter<void>()
  @Output() logoutEvent = new EventEmitter<void>()
  @Output() manualEvent = new EventEmitter<void>()
  @Output() addTaskEvent = new EventEmitter<void>()

  constructor(
    private tasksService: TasksService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
  }

  showNotDone(): void {
    this.tasksService.filter = 'notDone'
    this.closeEvent.emit()
  }
  
  showDone(): void {
    this.tasksService.filter = 'done'
    this.closeEvent.emit()
  }
  
  showAll(): void {
    this.tasksService.filter = 'all'
    this.closeEvent.emit()
  }


  deleteAll(): void {
    let ids = []
    this.tasksService.getTasks().subscribe(
      (tasks) => this.dialogService
        .setTaskToDeleteIds(tasks.map(task => task.id)),
      (error) => console.log(error)
    )
    this.dialogService.open()
    setTimeout(() => this.closeEvent.emit(), 200)
  }
  
  
  deleteAllDone() {
    this.tasksService.getTasks().subscribe(
      (tasks) => this.dialogService
        .setTaskToDeleteIds(tasks
          .filter(task => task.done === true)
          .map(task => task.id)
        ),
      (error) => console.log(error)
    )
    this.dialogService.open()
    setTimeout(() => this.closeEvent.emit(), 200)
  }
}

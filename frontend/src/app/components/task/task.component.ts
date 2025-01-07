import { Component, Input, Output, EventEmitter, HostBinding, OnInit} from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from '../../models/task'
import { Subtask } from '../../models/subtask'
import { DialogService } from 'src/app/services/dialog.service';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() task: Task
  @Input() index: number

  @Output() deleteEvent = new EventEmitter<void>()
  @Output() editEvent = new EventEmitter<void>()
  
  @HostBinding('class.important') important: boolean

  constructor(
    private tasksService: TasksService,
    private dialogService: DialogService
  ) {}

  visible: boolean = false
  showClass: boolean = false
  taskNameLimit: number = 40

  subtasks: Array<Subtask> = null

  ngOnInit(): void {
    this.important = this.task.important
  }
  

  onClick(): void {
    if (this.visible) this.hide()
    else this.show()
  }


  async markAsDone() {
    let marked = await this.tasksService
      .markAsDone(this.task.id, !this.task.done)
    if (marked) this.task.done = !this.task.done
  }


  editTask(): void {
    this.tasksService.editTaskId = this.task.id
    this.editEvent.emit()
  }

  deleteTask() {
    this.dialogService.setTaskToDeleteIds([this.task.id])
    this.dialogService.open()
  }

  async markAsImportant() {
    let marked = await this.tasksService
      .markAsImportant(this.task.id, !this.task.important)
    if (marked) this.task.important = !this.task.important
    this.important = this.task.important
  }


  async markSubtaskAsDone(i: number) {
    if (this.subtasks[i]) {
      let subtasks = JSON.parse(JSON.stringify(this.subtasks))
      subtasks[i].done = !subtasks[i].done
      let marked = await this.tasksService
        .updateSubtasks(this.task.id, JSON.stringify(subtasks))
      if (marked) { 
        this.subtasks[i].done = !this.subtasks[i].done
        this.task.subtasks = JSON.stringify(subtasks)
      }
    }
  }


  
  private show(): void {
    if (this.task.subtasks) { 
      this.subtasks = JSON.parse(this.task.subtasks) as Array<Subtask>
    }
    this.visible = true
    setTimeout(() => this.showClass = true, 10)
    let increment = setInterval(() => { 
      this.taskNameLimit++
      if (this.taskNameLimit > this.task.name.length) { 
        clearInterval(increment)
      }
    }, 10)
  }
  

  private hide(): void {
    this.showClass = false
    setTimeout(() => this.visible = false, 300)
    let decrement = setInterval(() => { 
      this.taskNameLimit--
      if (this.taskNameLimit <= 40) { 
        clearInterval(decrement)
      }
    }, 10)
  }


}

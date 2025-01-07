import { Component, OnInit, Output, EventEmitter, ViewChildren, ElementRef } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { TasksService } from 'src/app/services/tasks.service'
import { map } from 'rxjs/operators'
import { Task } from '../../models/task'
import { Subtask } from '../../models/subtask'

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent implements OnInit {

  @Output() backEvent = new EventEmitter<void>()

  task: Task
  subtasks: Subtask[] = []
  _subtasks: number[] = []

  editForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    deadline: new FormControl(''),
    subtasks: new FormControl(),
  })


  constructor(private tasksService: TasksService) {
    this.tasksService.filter = 'all'
    this.tasksService.getTasks()
      .pipe(map(tasks => tasks.find(task => task.id === this.tasksService.editTaskId)))
      .subscribe(task => this.task = task as Task)
    
    if (this.task.subtasks) { 
      this.subtasks = JSON.parse(this.task.subtasks)
    }
  }
  
  submitted = false

  errorMsg = ''
  message = ''

  get f() { return this.editForm.controls }
  
  onFocusout(): void { this.submitted = true }

  @ViewChildren('subtaskInputReference')
  subtaskInputReference: ElementRef

  ngOnInit(): void {

    this.editForm.controls.name.setValue(this.task.name)
    this.editForm.controls.deadline.setValue(this.task.deadline)

    this.subtasks?.forEach((subtask, index) => { 
      this._subtasks.push(index + 1)
      this.editForm.addControl(this.subtaskName(index + 1), 
        new FormControl(subtask.name, [
          Validators.required,
          Validators.maxLength(50)
        ])
      )
    })

  }

  async onSubmit() {
    this.submitted = true
    if (this.editForm.invalid) return

    this.task.name = this.editForm.value.name
    this.task.deadline = this.editForm.value.deadline
    this.task.subtasks = this._subtasks ? this.getSubtasksAsString() : null
    
    let updated = await this.tasksService.updateTask(this.task)
    if (updated) {
      this.message = 'Zaktualizowano'
      this.errorMsg = ''
      setTimeout(() => this.backEvent.emit(), 200)
    } else { 
      this.errorMsg = 'Błąd - spróbuj ponownie'
    }
  }

  markTaskAsDone(): void { 
    this.task.done = !this.task.done
  }


  // subtasks

  addSubtask(): void {
    let number = 1
    if (this._subtasks.length) {
      number = this._subtasks[this._subtasks.length - 1] + 1
    }

    this._subtasks.push(number)
    this.subtasks.push({
      name: '',
      done: false,
    } as Subtask)

    
    this.editForm.addControl(
      this.subtaskName(number),
      new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ])
    )

    setTimeout(() => { 
      this.subtaskInputReference['_results'][number-1]
        .nativeElement.focus()
    }, 200)
  }

  removeSubtask(number: number): void {
    this._subtasks = this._subtasks.filter(el => el !== number)
    this.editForm.removeControl(this.subtaskName(number))
  }

  markSubtaskAsDone(number: number): void {
    this.subtasks[number].done = !this.subtasks[number].done
  }

  subtaskName(number: number): string { 
    return 'subtask-' + number
  }


  private getSubtasksAsString(): string {

    let subtasksArr: Array<Subtask> =
      this._subtasks.map(number => {
      return {
        name: this.editForm.value[this.subtaskName(number)],
        done: this.subtasks[number-1].done
      } as Subtask
     })
    return subtasksArr.length? JSON.stringify(subtasksArr) : ''
  }

}

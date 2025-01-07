import { Component, Output, EventEmitter, ViewChildren, ElementRef } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/models/task';
import { Subtask } from 'src/app/models/subtask';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-adding-form',
  templateUrl: './adding-form.component.html',
  styleUrls: [
    './adding-form.component.scss',
    '../../../assets/flaticon/flaticon.scss'
  ]
})
export class AddingFormComponent {

  @Output() addEvent = new EventEmitter<void>()
  @Output() backEvent = new EventEmitter<void>()

  constructor(private tasksService: TasksService) { }

  addingForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    deadline: new FormControl(''),
    subtasks: new FormControl(),
  })

  submitted = false

  errorMsg = ''
  message = ''

  
  get f() { return this.addingForm.controls }
  
  onFocusout(): void { this.submitted = true }

  @ViewChildren('subtaskInputReference')
  subtaskInputReference: ElementRef
  

  async onSubmit() {
    this.submitted = true
    if (this.addingForm.invalid) return

    let addForm: Partial<Task> = {
      name: this.addingForm.value.name,
      subtasks: this.subtasks? this.getSubtasksAsString() : null
    }

    if (this.addingForm.value.deadline) { 
      addForm.deadline = this.addingForm.value.deadline
    }

    this.tasksService.addTask(addForm)
    setTimeout(() => this.addEvent.emit(), 200)
  }
  

  // subtasks
  subtasks: Array<number> = []

  addSubtask(): void {
    let number = 1
    if (this.subtasks.length) {
      number = this.subtasks[this.subtasks.length - 1] + 1
    }
    this.subtasks.push(number)

    this.addingForm.addControl(
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
    this.subtasks = this.subtasks.filter(el => el !== number)
    this.addingForm.removeControl(this.subtaskName(number))
  }


  subtaskName(number: number): string { 
    return 'subtask-' + number
  }


  private getSubtasksAsString(): string {
    let subtasksArr: Array<Subtask> =
      this.subtasks.map(number => {
      return {
        name: this.addingForm.value[this.subtaskName(number)],
        done: false
      } as Subtask
     })
    return subtasksArr.length? JSON.stringify(subtasksArr) : ''
  }

}

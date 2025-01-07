import { Component,  OnInit } from '@angular/core'
import { DialogService } from './services/dialog.service';
import { TasksService } from './services/tasks.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
  
export class AppComponent implements OnInit {

  pages = {
    loginForm: {
      active: false,
      class: ''
    },
    registerForm: {
      active: false,
      class: ''
    },
    menu: {
      active: false,
      class: ''
    },
    manual: {
      active: false,
      class: ''
    },
    tasksBoard: {
      active: true,
      class: ''
    },
    addForm: {
      active: false,
      class: ''
    },
    editForm: {
      active: false,
      class: ''
    },
  }

  constructor(
    private tasksService: TasksService,
  ) { }

  ngOnInit(): void {
    this.tasksService._redirectToLoginPage.subscribe(() => { 
      if (!this.pages.loginForm.active) { 
        this.pageFromTo('tasksBoard', 'loginForm', 'back')
      }
    })
  }
  
  changePageDuration: number = 300

  login(): void {
    this.pages.tasksBoard.active = true
    this.pages.tasksBoard.class = ''
    setTimeout(() => { 
      this.pages.loginForm.class = 'close'
      setTimeout(() => { 
        this.pages.loginForm.class = ''
        this.pages.loginForm.active = false
      }, this.changePageDuration)
    },200)
  }


  logout(): void {
    localStorage.removeItem('token')
    setTimeout(() => { 
      this.pageFromTo('menu', 'loginForm', 'next')
    },50)
  }
  
  
  pageFromTo(from: string, to: string, direction: string): void {
    if (this.isPageValid(from, to, direction)) {
      
      if (direction === 'back') {
        this.pages[to].active = true
        this.pages[to].class = ''
        this.pages[from].class = 'close'
        setTimeout(() => { 
          this.pages[from].class = ''
          this.pages[from].active = false
        }, this.changePageDuration )
        
      } else { 
        this.pages[to].active = true
        this.pages[to].class = 'open'
        setTimeout(() => { 
          this.pages[from].active = false
          this.pages[to].class = ''
        }, this.changePageDuration )
      }
    }
  }

  buttonIcon = 'add' // or 'errorPink'

  onButton(): void {
    if (this.pages.tasksBoard.active) {
      this.pageFromTo('tasksBoard', 'addForm', 'next')
      this.buttonIcon = 'error'
    } else { 
      this.pageFromTo('addForm', 'tasksBoard', 'back')
      this.buttonIcon = 'add'
    }
  }
  
  addTask(): void {
    this.pageFromTo('addForm', 'tasksBoard', 'back')
    this.buttonIcon = 'add'
  }

  
  private isPageValid(from: string, to: string, direction: string): boolean {
    if (direction !== 'next' && direction !== 'back')
      throw new Error('direction has to be next to back')
    if (Object.keys(this.pages).includes(from) &&
      Object.keys(this.pages).includes(to))
    return true
    else throw new Error('no such page declared')
  }
}


import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Task } from "./task-model"
import { UserService } from '../users/user.service'
import { environment } from '../../environments/environment'
import { TasksOnlineService } from './tasks-online.service'
import { StorageService } from '../services/storage.service'

export type taskFilter = 'all' | 'done' | 'todo'

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private tasksObs = new BehaviorSubject<Task[]>([])
  private tasksSnapshot: Task[] = []

  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private tasksOnline: TasksOnlineService
  ) {
      
    this.initTasksService()
  }

  public get tasks(): Task[] {
    return this.tasksSnapshot
  }

  public get uid(): string {
    if (this.userService.id) return this.userService.id
    else throw new Error('user not initialized')
  }
  
  public getTasksObs(): Observable<Task[]> {
    return this.tasksObs
      .asObservable()
      .pipe(map(tasks => this.filterTasks(tasks)))
  }

  public cleared: boolean = false

  public clearObservable(): void {
    this.tasksObs.next([])
    this.cleared = true
  }

  public getTaskById = (id: string) => this.tasksSnapshot.find(task => task.id === id)


  public async addTask(task: Task): Promise<boolean> {
    this.checkInitialization()
    try {
      if (this.onlineMode) {
        task.id = await this.tasksOnline.addTask(task)
        if (!task.id) throw new Error('add task online failed')
      } 

      if (this.userService.offlineMode) task.modifiedOffline = true

      await this.setTasksStorage([...this.tasksSnapshot, task])
      return true
    }
    catch (error) {
      return false
    }
  }

  public async editTask(newTask: Task): Promise<boolean> {
    this.checkInitialization()
    try {
      const i = this.tasksSnapshot.findIndex(t => t.id === newTask.id)
      this.tasksSnapshot.splice(i, 1, newTask)

      if (this.onlineMode) {
        const result = await this.tasksOnline.editTask(newTask)
        if (!result) throw new Error('edit task online failed')
      }

      if (this.userService.offlineMode) newTask.modifiedOffline = true

      await this.setTasksStorage(this.tasksSnapshot)
      return true
    }
    catch (error) {
      return false
    }
  }

  public async removeTask(taskId: string): Promise<boolean> {
    this.checkInitialization()
    try {
      if (this.onlineMode) {
        const result = await this.tasksOnline.removeTask(taskId)
        if (!result) throw new Error('remove task online failed')
      }

      if (this.userService.offlineMode) {
        const task = this.tasksSnapshot.find(task => task.id === taskId)
        task.name = '$$delete$$'
        await this.setTasksStorage(this.tasksSnapshot)
        return true
      }

      await this.setTasksStorage(this.tasksSnapshot.filter(task => task.id !== taskId))
      return true
    }
    catch (error) {
      return false
    }
  }

  public async markAsDone(taskId: string): Promise<boolean> {
    this.checkInitialization()
    try {
      const task = this.tasksSnapshot.find(task => task.id === taskId)
      task.done = !task.done
      if (this.onlineMode) {
        const result = await this.tasksOnline.markAsDone(taskId, task.done)
        if (!result) throw new Error('mark as done online failed')
      }

      if (this.userService.offlineMode) task.modifiedOffline = true

      await this.setTasksStorage(this.tasksSnapshot)
      return true
    }
    catch (error) {
      return false
    }
  }
  
  public async important(taskId: string): Promise<boolean> {
    this.checkInitialization()
    try {
      const task = this.tasksSnapshot.find(task => task.id === taskId)
      task.important = !task.important

      if (this.onlineMode) {
        const result = await this.tasksOnline.markAsImportant(taskId, task.important)
        if (!result) throw new Error('mark as done online failed')
      }

      if (this.userService.offlineMode) task.modifiedOffline = true

      await this.setTasksStorage(this.tasksSnapshot)
      return true
    }
    catch (error) {
      return false
    }
  }

  public async markSubtaskAsDone(taskId: string, subtaskIndex: number): Promise<boolean> {
    this.checkInitialization()
    try {
      const task = this.tasksSnapshot.find(task => task.id === taskId)
      if (task && task.subtasks[subtaskIndex]) {
        task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done
      } else throw new Error ('subtask index error')

      if (this.onlineMode) {
        const result = await this.tasksOnline.updateSubtasks(taskId, task.subtasks)
        if (!result) throw new Error('markSubtaskAsDone online failed')
      }

      if (this.userService.offlineMode) task.modifiedOffline = true

      await this.setTasksStorage(this.tasksSnapshot)
      return true
    }
    catch (error) {
      return false
    }
  }

  public async reorder(fromId: string, toId: string): Promise<boolean> {
    this.checkInitialization()
    try {
      const fromIndex = this.tasksSnapshot.findIndex(t => t.id === fromId)
      const toIndex = this.tasksSnapshot.findIndex(t => t.id === toId)
      let reorderedTasks = copy(this.tasksSnapshot)
      const taskToMove = reorderedTasks.splice(fromIndex, 1).pop()
      reorderedTasks.splice(toIndex, 0, taskToMove)

      if (this.onlineMode) {
        const result = await this.tasksOnline.reorder(reorderedTasks)
        if (!result) throw new Error('reorder online failed')
      }

      if (this.userService.offlineMode) reorderedTasks.forEach(t => t.modifiedOffline = true)

      await this.setTasksStorage(reorderedTasks)
      return true
    }
    catch (error) {
      return false
    }
  }

  public async deleteAll(): Promise<boolean> {
    this.checkInitialization()
    try {
      if (this.onlineMode) {
        const result = await this.tasksOnline.deleteAll()
        if (!result) throw new Error('deleteAll online failed')
      }

      if (this.userService.offlineMode) {
        this.tasksSnapshot.forEach(t => t.name = '$$delete$$')
        await this.setTasksStorage(this.tasksSnapshot)
        return true
      }

      await this.resetTasksStorage()
      return true
    }
    catch (error) {
      return false
    }
  }


  public async deleteAllDone(): Promise<boolean> {
    this.checkInitialization()
    try {
      if (this.onlineMode) {
        const result = await this.tasksOnline.deleteAllDone()
        if (!result) throw new Error('deleteAllDone online failed')
      }

      if (this.userService.offlineMode) {
        this.tasksSnapshot.filter(t => t.done).forEach(t => t.name = '$$delete$$')
        await this.setTasksStorage(this.tasksSnapshot)
        return true
      }
      
      await this.setTasksStorage(this.tasksSnapshot)
      return true
    }
    catch (error) {
      return false
    }
  }



  // INITIALIZATION

  private initialized: boolean = false

  private async initTasksService(): Promise<void> {
    if (this.initialized) return
    try {
      await this.loadTasksFromStorage()
      await this.loadTasksOnline()
      this.tasksObs.subscribe(t => {
        this.tasksSnapshot = t
      })
      this.initialized = true
    } 
    catch (error) {
    }
  }



  // STORAGE

  public async loadTasks(): Promise<void> {
    if (!this.initialized) this.initTasksService()
    else {
      await this.loadTasksFromStorage()
      await this.loadTasksOnline()
    }
  }

  private get storageKey() {
    const key = `${environment.dataUsersKey}_${this.userService.id}_tasks`
    if (!key) throw new Error('dataUsersKey error')
    return key
  }

  private async loadTasksFromStorage(): Promise<void> {
    const tasks = await this.storageService.getItem(this.storageKey) as Task[]
    if (tasks && tasks.length) this.tasksObs.next(tasks)
  }


  private async setTasksStorage(tasks: Task[]): Promise<void> {
    await this.storageService.setItem(this.storageKey, tasks)
    this.tasksObs.next(tasks)
  }


  private async resetTasksStorage(): Promise<boolean> {
    if (this.tasksSnapshot && this.tasksSnapshot.length && this.storageKey) {
      await this.storageService.removeItem(this.storageKey)
      this.tasksObs.next([])
      return true
    } else throw new Error('no tasks or no key')
  }



  // ONLINE

  get onlineMode(): boolean {
    return this.userService.online && !this.userService.offlineMode
  }

  private async loadTasksOnline() {
    if (this.onlineMode) {
      const onlineTasks = await this.tasksOnline.getTasks()
      if (!onlineTasks) throw new Error('Obsluzyc get online tasks fail')
      this.resolveTasksConflicts(onlineTasks)
    }
  }




  private resolveTasksConflicts(onlineTasks: Task[]) {
    // deleted offline
    let tasksDeletedOfflineIds = this.tasksSnapshot
      .filter(t => t.name === '$$delete$$')
      .map(t => t.id)

    let result = onlineTasks.filter(task => !tasksDeletedOfflineIds.includes(task.id))
      
    let tasksModifiedOffline = this.tasksSnapshot.filter(t => t.modifiedOffline === true)
    tasksModifiedOffline.forEach(t => {
      const taskExistsIndex = result.findIndex(tr => t.id === tr.id)
      if (taskExistsIndex !== -1) {
        result[taskExistsIndex] = t
      } else {
        result.push(t)
      }
    })
    this.tasksObs.next(result)
    this.setTasksStorage(result)
  }



  // TASKS VIEW FILTER

  public filter: taskFilter = 'todo'

  private filterTasks(tasks: Task[]): Task[] {
    if (!tasks) return null
    let result = tasks
    switch (this.filter) { 
      case 'done': result = tasks.filter(task => task.done)
        break;
      case 'todo': result = tasks.filter(task => !task.done)
        break;
    }
    return result
  }

  public setFilter(filter: taskFilter): void {
    this.filter = filter
    this.tasksObs.next(this.tasksSnapshot)
  }
    

  // EDIT FORM
  editingTaskId: string


  checkInitialization(): void {
    if (this.initialized) return
    else throw new Error("not initialized!!")
  }

}

const copy = (item: any) => JSON.parse(JSON.stringify(item))
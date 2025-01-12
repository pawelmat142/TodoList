import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs/'
import { environment } from '../../environments/environment'
import { dataRespone } from '../models/dataResponse'
import { Router } from '@angular/router'
import { nUser } from './user'
import { StorageService } from '../services/storage.service'

// LISTA USEROW ZALADOWANYCH DO URZADZENIA

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersObs = new BehaviorSubject<nUser[]>([])
  private usersSnapshot: nUser[] = []
  
  constructor(
    public router: Router,
    public storageService: StorageService,

  ) { 
    this.router.navigateByUrl('/start', { replaceUrl: true})

    this.usersObs.subscribe(u => {
      this.usersSnapshot = u ? u : []
    })
  }
  

  // INIT TRIGGERED BY APP SERVICE
  public async initUsers(): Promise<void> {
    await this.loadUsers()
  }


  public get users(): nUser[] {
    return this.usersSnapshot 
  }
  
  public getUsersObs(): Observable<nUser[]> {
    return this.usersObs.asObservable()
  }

  public getUserById(id: string): nUser {
    const user = this.usersSnapshot.find(u => u.id === id)
    return user? user : null
  }


  public async addOnlineExistingUser(user: nUser): Promise<dataRespone> {
    if (this.userExists(user.nickname)) {
      return { state: false, message: 'Użytkownik o takim nicku już istnieje!' }
    }
    const usersBefore = this.usersSnapshot
    const success = await this.setUsersToStorage([...this.usersSnapshot, user] as nUser[])

    if (success) return { state: true, message: `Dodano użytkownika: ${user.nickname}!`}
    else {
      this.setUsersToStorage(usersBefore)
      return { state: false, message: 'Błąd zapisu do bazy!'}
    }
  }


  public async addNewUser(newUser: nUser): Promise<boolean> {
    const usersBefore = this.usersSnapshot
    const success = await this.setUsersToStorage([...this.usersSnapshot, newUser] as nUser[])
    if (success) return true
    else {
      this.setUsersToStorage(usersBefore)
      return false
    }
  }


  public async removeUserToken(userId: string) {
    this.usersSnapshot.find(u => u.id === userId)['token'] = ''
    this.setUsersToStorage(this.usersSnapshot)
  }
    

  // STORAGE STAFF

  public async deleteUserInStorage(id: string): Promise<boolean> {
    const index = this.usersSnapshot.findIndex(u => u.id === id)
    const deletedUser = this.usersSnapshot.splice(index, 1)
    if (deletedUser.length) {
      await this.setUsersToStorage(this.usersSnapshot)

      await this.storageService.removeItem(`${this.key}_${id}_tasks`)
      await this.storageService.removeItem(`${this.key}_${id}_notes`)
      return true
    } 
    return false
  }


  private get key(): string {
    return environment.dataUsersKey
  }

  private async loadUsers(): Promise<void> {
    const users = await this.storageService.getItem(this.key) as nUser[] || null
    this.usersObs.next(users)
  }

  private async resetUsers(): Promise<void> {
    await this.storageService.removeItem(this.key)
    this.usersObs.next(null)
  }

  private async setUsersToStorage(users: nUser[]): Promise<boolean> {
    const usersPrev = this.usersSnapshot
    this.usersObs.next(users)
    try {
      await this.storageService.setItem(this.key, users)
      return true
    } catch (error) {
      this.usersObs.next(usersPrev)
      return false
    }
  }


  // OTHERS

  private userExists = (nickname: string): boolean => {
    return !!this.usersSnapshot.find(n => n.nickname === nickname)
  }

}

const copy = (item: any) => JSON.parse(JSON.stringify(item))

 
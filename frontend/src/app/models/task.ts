import { Subtask } from './subtask'

export interface Task { 
  id?: number, 
  user_id?: number,
  name: string,
  important: boolean,
  deadline?: Date,
  done: boolean,
  subtasks?: string,
}
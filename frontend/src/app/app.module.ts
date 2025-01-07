import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
registerLocaleData(localePl);

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

// pages
import { AddingFormComponent } from './pages/adding-form/adding-form.component';
import { TasksBoardComponent } from './pages/tasks-board/tasks-board.component';
import { LoginFormComponent } from './pages/login-form/login-form.component';
import { RegisterFormComponent } from './pages/register-form/register-form.component';
import { MenuComponent } from './pages/menu/menu.component';
import { EditFormComponent } from './pages/edit-form/edit-form.component';

// other components
import { HeaderComponent } from './components/header/header.component';
import { TaskComponent } from './components/task/task.component';
import { IconBtnComponent } from './components/icon-btn/icon-btn.component';

import { LimitToPipe } from './pipes/limit-to.pipe';
import { ManualComponent } from './pages/manual/manual.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { CustomDatePipe } from './pipes/custom-date.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AddingFormComponent,
    TaskComponent,
    IconBtnComponent,
    TasksBoardComponent,
    LoginFormComponent,
    RegisterFormComponent,
    LimitToPipe,
    MenuComponent,
    EditFormComponent,
    ManualComponent,
    DialogComponent,
    CustomDatePipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

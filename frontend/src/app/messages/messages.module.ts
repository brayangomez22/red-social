import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MessagesRoutingModule } from './messages-routing.module';

import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SendedComponent } from './components/sended/sended.component';

@NgModule({
    declarations: [
        MainComponent,
        AddComponent,
        ReceivedComponent,
        SendedComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        MessagesRoutingModule
    ],
    exports: [
        MainComponent,
        AddComponent,
        ReceivedComponent,
        SendedComponent
    ],
    providers: []
})
export class MessagesModule { }
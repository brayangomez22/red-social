import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SendedComponent } from './components/sended/sended.component';

import { UserGuard } from '../services/user.guard';

const messagesRoutes: Routes = [
    {
        path: 'messages',
        component: MainComponent,
        children: [
            { path: '', redirectTo: 'received/1', pathMatch: 'full' },
            { path: 'send', component: AddComponent, canActivate:[UserGuard] },
            { path: 'received', component: ReceivedComponent, canActivate:[UserGuard] },
            { path: 'received/:page', component: ReceivedComponent, canActivate:[UserGuard] },
            { path: 'sent', component: SendedComponent, canActivate:[UserGuard] },
            { path: 'sent/:page', component: SendedComponent, canActivate:[UserGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(messagesRoutes)],
    exports: [
        RouterModule
    ]
})
export class MessagesRoutingModule {}
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './app.routing';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'ngx-moment';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { PublicationsComponent } from './components/publications/publications.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowedComponent } from './components/followed/followed.component';
import { MainComponent } from './messages/components/main/main.component';
import { AddComponent } from './messages/components/add/add.component';
import { ReceivedComponent } from './messages/components/received/received.component';
import { SendedComponent } from './messages/components/sended/sended.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        UserEditComponent,
        UsersComponent,
        SidebarComponent,
        TimelineComponent,
        PublicationsComponent,
        ProfileComponent,
        FollowingComponent,
        FollowedComponent,
        MainComponent,
        AddComponent,
        ReceivedComponent,
        SendedComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        routing,
        MomentModule
    ],
    providers: [
        appRoutingProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

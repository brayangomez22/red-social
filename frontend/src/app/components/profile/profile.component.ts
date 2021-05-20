import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Follow } from 'src/app/models/follow';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FollowService } from 'src/app/services/follow.service';
import { GLOBAL } from 'src/app/services/global';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    providers: [ UserService, FollowService ]
})
export class ProfileComponent implements OnInit {

    public title;
    public user: User;
    public status;
    public identity;
    public token;
    public stats;
    public url; 
    public follow;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ) {
        this.title = 'Profile';
        this.user = this._userService.getIdentity();
        this.identity = this.user;
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(): void {
    }

}

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
    public user!: User;
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
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(): void {
        this.loadPage();
    }

    loadPage() {
        this._route.params.subscribe(params => {
            let id = params['id'];
            this.getUser(id);
            this.getCounters(id);
        });
    }

    getUser(id) {
        this._userService.getUser(id).subscribe(
            response => {
                if (response.user) {
                    this.user = response.user;
                } else {
                    this.status = 'error';
                }
            },
            error => {
                console.log(<any>error);
                this._router.navigate(['/profile', this.identity._id]);
            }
        );
    }

    getCounters(id) {
        this._userService.getCounters(id).subscribe(
            response => {
                this.stats = response;
            }, 
            error => {
                console.log(<any>error);
            }
        );
    }
}

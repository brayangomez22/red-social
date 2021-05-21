import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Follow } from 'src/app/models/follow';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FollowService } from 'src/app/services/follow.service';
import { GLOBAL } from 'src/app/services/global';

@Component({
    selector: 'app-following',
    templateUrl: './following.component.html',
    styleUrls: ['./following.component.scss'],
    providers: [ UserService, FollowService ]
})
export class FollowingComponent implements OnInit {

    public title: string;
    public url: string;
    public identity;
    public token;
    public page;
    public next_page;
    public prev_page;
    public total;
    public pages;
    public users: User[];
    public follows;
    public status: string;
    public following;
    public followUserOver;
    public userPageId;
    public user!: User;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _useService: UserService,
        private _followService: FollowService
    ) {
        this.users = [];
        this.status = '';
        this.url = GLOBAL.url;
        this.title = 'Users followed by';
        this.identity = this._useService.getIdentity();
        this.token = this._useService.getToken();
    }

    ngOnInit(): void {
        this.actualPage();
    }

    actualPage() {
        this._route.params.subscribe(params => {
            let user_id = params['id'];
            this.userPageId = user_id;
            
            let page = + params['page'];
            this.page = page;

            if (!params['page']) {
                page = 1;
            }

            if (!page) {
                page = 1;
            } else {
                this.next_page = page + 1;
                this.prev_page = page - 1;

                if (this.prev_page <= 0) {
                    this.prev_page = 1;
                }
            }

            this.getUser(user_id, page);
        });
    }

    getFollows(user_id, page) {
        this._followService.getFollowing(this.token, user_id, page).subscribe(
            response => {
                if (!response.follows) {
                    this.status = 'error';
                } else {
                    console.log(response);
                    

                    this.total = response.total;
                    this.following = response.follows;
                    this.pages = response.pages;
                    this.follows = response.users_following;

                    if (page > this.pages) {
                        this._router.navigate(['/following',1]);
                    } 
                }
            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);
                
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    getUser(user_id, page) {
        this._useService.getUser(user_id).subscribe(
            response => {
                if (response.user) {
                    this.user = response.user;
                    this.getFollows(user_id, page);
                } else {
                    this._router.navigate(['/home']);
                }
            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);
                
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    mouseEnter(user_id) {
        this.followUserOver = user_id;
    }

    mouseLeave(user_id) {
        this.followUserOver = 0;
    }

    followUser(followed) {
        let follow = new Follow('', this.identity._id, followed);

        this._followService.addFollow(this.token, follow).subscribe(
            response => {
                if (!response.follow) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    this.follows.push(followed);
                }
            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    unFollowUser(followed) {
        this._followService.deleteFollow(this.token, followed).subscribe(
            response => {
                let search = this.follows.indexOf(followed);
                if (search != -1) {
                    this.follows.splice(search, 1);
                }
            },
            error => {
                let errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

}

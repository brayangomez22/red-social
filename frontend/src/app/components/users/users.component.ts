import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from 'src/app/services/global';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    providers: [ UserService ]
})
export class UsersComponent implements OnInit {

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
    public followUserOver;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _useService: UserService
    ) {
        this.users = [];
        this.status = '';
        this.url = GLOBAL.url;
        this.title = 'People';
        this.identity = this._useService.getIdentity();
        this.token = this._useService.getToken();
    }

    ngOnInit(): void {
        this.actualPage();
    }

    actualPage() {
        this._route.params.subscribe(params => {
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

            this.getUsers(page);
        });
    }

    getUsers(page) {
        this._useService.getUsers(page).subscribe(
            response => {
                if (!response.users) {
                    this.status = 'error';
                } else {
                    this.total = response.total;
                    this.users = response.users;
                    this.pages = response.pages;
                    this.follows = response.users_following;

                    if (page > this.pages) {
                        this._router.navigate(['/people',1]);
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

    mouseEnter(user_id) {
        this.followUserOver = user_id;
    }

    mouseLeave(user_id) {
        this.followUserOver = 0;
    }
}

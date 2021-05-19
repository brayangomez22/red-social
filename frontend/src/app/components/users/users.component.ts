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
    public identity;
    public token;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _useService: UserService
    ) {
        this.title = 'People';
        this.identity = this._useService.getIdentity();
        this.token = this._useService.getToken();
    }

    ngOnInit(): void {
    }

}

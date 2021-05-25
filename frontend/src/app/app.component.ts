import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [ UserService ]
})
export class AppComponent implements OnInit, DoCheck {
    public title: string;
    public identity;
    public url: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _useService: UserService
    ) {
        this.title = 'SOFKA SOCIAL';
        this.url = GLOBAL.url;
    }

    ngOnInit(): void {
        this.identity = this._useService.getIdentity();
    }

    ngDoCheck() {
        this.identity = this._useService.getIdentity();
    }

    logOut() {
        localStorage.clear();
        this.identity = null;
        this._router.navigate(['/']);
    }
}

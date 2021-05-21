import { Component, OnInit } from '@angular/core';
import { Follow } from 'src/app/models/follow';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FollowService } from 'src/app/services/follow.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from 'src/app/services/global';

@Component({
    selector: 'app-sended',
    templateUrl: './sended.component.html',
    styleUrls: ['./sended.component.scss'],
    providers: [ MessageService, FollowService, UserService ]
})
export class SendedComponent implements OnInit {

    public title: string;
    public messages: Message[];
    public url: string;
    public identity;
    public token;
    public status;
    public follows;
    public page;
    public next_page;
    public prev_page;
    public total;
    public pages;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _messageService: MessageService,
        private _followService: FollowService,
        private _userService: UserService
    ) {
        this.title = 'Sent Messages';
        this.messages = [];
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
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

            this.getMessages(this.token, this.page);
        });
    }

    getMessages(token, page) {
        this._messageService.getEmitterMessages(token, page).subscribe(
            response => {
                if (response.messages) {
                    this.messages = response.messages;
                    this.total = response.total;
                    this.pages = response.pages;
                }
            },  
            error => {
                console.log(<any>error);
            }
        );
    }
}

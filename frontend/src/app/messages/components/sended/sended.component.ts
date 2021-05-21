import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sended',
    templateUrl: './sended.component.html',
    styleUrls: ['./sended.component.scss']
})
export class SendedComponent implements OnInit {

    public title: string;

    constructor() {
        this.title = 'Sent Messages';
    }

    ngOnInit(): void {
    }

}

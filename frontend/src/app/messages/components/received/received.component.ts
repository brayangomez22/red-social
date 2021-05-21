import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-received',
    templateUrl: './received.component.html',
    styleUrls: ['./received.component.scss']
})
export class ReceivedComponent implements OnInit {

    public title: string;

    constructor() {
        this.title = 'Received Messages';
    }

    ngOnInit(): void {
    }

}

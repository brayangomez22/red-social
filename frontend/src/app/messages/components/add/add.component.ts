import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

    public title: string;

    constructor() {
        this.title = 'Send Messages';
    }

    ngOnInit(): void {
    }

}

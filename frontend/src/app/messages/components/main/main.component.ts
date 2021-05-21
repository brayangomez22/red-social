import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    public title: string;

    constructor() {
        this.title = 'Private messages';
    }

    ngOnInit(): void {
    }

}

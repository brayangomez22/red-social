import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public title: string;

    constructor() {
        this.title = 'Bienvenido a NGSocial';
    }

    ngOnInit(): void {
    }

}

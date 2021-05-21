interface userPublication {
    _id: string;
    name: string;
    email: string;
    image: string;
    nick: string;
    surname: string;
}

export class Publication{
    constructor(
        public _id: string,
        public text: string,
        public file: string,
        public created_at: string,
        public user: userPublication
    ) {}
}
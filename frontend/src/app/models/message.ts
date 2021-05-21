interface emitterMessage {
    _id: string;
    image: string;
    name: string;
    nick: string;
    surname: string;
}

export class Message{
    constructor(
        public _id: string,
        public text: string,
        public viewed: string,
        public created_at: string,
        public emitter: emitterMessage,
        public receiver: emitterMessage
    ) {}
}
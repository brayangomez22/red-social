'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = 3800;

mongoose.Promise = global.Promise;
mongoose
	.connect('mongodb://localhost/red-social', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
    .then((db) => {
        console.log('Db is connected');

        app.listen(port, () => {
            console.log('Server Ready');
        })
    })
	.catch((err) => console.log(err))
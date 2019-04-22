const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config');
const { authRoutes, userRoutes, homeRoutes } = require('./routes');

const app = express();

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true })
	.then(() => console.log('MongoDB connected'))
	.catch(error => console.log(error));
mongoose.set('useCreateIndex', true);

app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(require('cors')());

app.use('/api/v1', authRoutes);
app.use('/api/v1', homeRoutes);
app.use('/api/v1/profile', userRoutes);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('../client/dist/client'));

	app.get('*', (req, res) => {
		res.sendFile(
			path.resolve(
				__dirname, '..', 'client', 'dist', 'client', 'index.html'
			)
		);
	});
}

module.exports = app;
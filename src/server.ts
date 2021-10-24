import bodyParser from 'body-parser';
import express from 'express';
import { deleteLocalFiles, filterImageFromURL } from './util/util';

(async () => {
	const app = express();

	const port = process.env.PORT || 8082;

	app.use(bodyParser.json());

	app.get('/', async (req, res) => {
		res.send('try GET /filteredimage?image_url={{}}');
	});

	app.get(`/filteredimage`, async (req, res) => {
		const imageUrl = req.query.image_url;

		if (!imageUrl) {
			return res
				.status(400)
				.json({ error: 'You need to pass a valid image_url!' });
		}

		let filteredimage: string = '';
		try {
			filteredimage = await filterImageFromURL(imageUrl);
			res.sendFile(filteredimage, () => {
				deleteLocalFiles([filteredimage]);
			});
		} catch (e) {
			console.error(e);
			res.status(422).send(e);
		}
	});

	app.listen(port, () => {
		console.log(`server running http://localhost:${port}`);
		console.log(`press CTRL+C to stop server`);
	});
})();

import express from 'express';
import bodyParser from 'body-parser';
require('dotenv').config();
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Created endpoint to filter an image from a public url.
  app.get("/filteredimage", async (req, res) => {
    try {
      let { image_url } = req.query;
      if (!image_url) {
        return res.status(400)
            .send('A valid image url is required!')
      }

      const filteredImage = await filterImageFromURL(image_url.toString())
      res.status(200)
          .sendFile(filteredImage)
      res.on('finish', () => deleteLocalFiles([filteredImage]));
    } catch (error) {
      return res.status(500)
          .send('Sorry! We are unable to download the image')
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });
  

  // Start the Server
  app.listen(port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  });
})();
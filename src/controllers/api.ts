import axios from 'axios';
import { Request, Response } from 'express';
import pjson from 'pjson';

export let getApi = (req: Request, res: Response) => {
  axios
    .get(req.url)
    .then((response) => {
      res.status(response.status);
      res.json(response.data);
    })
    .catch((err) => {
      res.status(501);
      res.send('Internal Server Error');
    });
};

export let getInfo = (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'knowyourmeme API wrapper',
    version: pjson.version,
    author: pjson.author,
    contributors: pjson.contributors,
    repository: pjson.repository.url,
  });
};

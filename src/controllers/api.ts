import axios from 'axios';
import { Request, Response } from 'express';
import pjson from 'pjson';

export let getInfo = (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'knowyourmeme API wrapper',
    version: pjson.version,
    author: pjson.author,
    contributors: pjson.contributors,
    repository: pjson.repository.url,
  });
};

export let getSearch = (req: Request, res: Response) => {
  const params = req.query.name;
  const url = `https://rkgk.api.searchify.com/v1/indexes/kym_production/instantlinks?query=${params}&field=name&fetch=name%2Curl%2Cicon_url&len=15`;

  axios
    .get(url)
    .then((response) => {
      res.status(response.status);
      res.json(response.data);
    })
    .catch((_err) => {
      res.status(501);
      res.send('Internal Server Error');
    });
};

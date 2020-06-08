import axios from 'axios';
import { Request, Response } from 'express';
import { JSDOM } from 'jsdom';
import pjson from 'pjson';
import sanitize from 'sanitize-html';

import { API_ENDPOINT } from '../util/settings';

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

export let getMemeDetails = (req: Request, res: Response) => {
  const url = `${API_ENDPOINT}${req.url}`;

  axios
    .get(url)
    .then((response) => {
      // extract body
      const bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(response.data)[1];

      // create virutal dom
      const doc = new JSDOM(bodyHtml);
      // get meme content
      const contentSection = doc.window.document.getElementsByClassName(
        'bodycopy'
      )[0];

      // sanitize html
      const bodyWithoutScripts = sanitize(contentSection.innerHTML);

      res.status(response.status);
      res.send(bodyWithoutScripts);
    })
    .catch((_err) => {
      res.status(501);
      res.send('Internal Server Error');
    });
};

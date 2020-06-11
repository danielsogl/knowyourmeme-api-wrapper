import axios from 'axios';
import { load } from 'cheerio';
import { Request, Response } from 'express';
import pjson from 'pjson';

import { MemeDetails } from '../models/meme.model';
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
      const $ = load(response.data);

      const name = $('.info h1 a')[0].children[0].data;
      const images = $('img');
      const image = getMemeImage(images, name);

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if (image.attribs['alt'] === name) {
          console.log(image.parent.attribs['href']);
        }
      }

      const about = $('.bodycopy');
      const children = about.children();

      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (child.attribs.id === 'about') {
          res.status(response.status);
          res.json({
            name,
            image,
            about: childrenToText(children[i + 1].children),
          } as MemeDetails);
        }
      }
    })
    .catch((_err) => {
      res.status(501);
      res.send('Internal Server Error');
    });
};

const childrenToText = (children: any) => {
  let text = '';

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (child.type === 'text') {
      if (!/^\s*\[\d+]\s*$/.test(child.data)) {
        text += child.data;
      }

      continue;
    }

    text += childrenToText(child.children);
  }

  return text;
};

const getMemeImage = (images: Cheerio, name: string): string => {
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    if (image.attribs['alt'] === name) {
      return image.parent.attribs['href'];
    }
  }

  return undefined;
};

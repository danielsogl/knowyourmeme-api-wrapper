import { load } from 'cheerio';

export class Meme {
  private $: CheerioStatic;

  constructor(data: string) {
    this.$ = load(data);
  }

  get name(): string {
    return this.$('.info h1 a')[0].children[0].data;
  }

  get image(): string {
    return this.$(`img[alt="${this.name}"]`).parent().attr('href');
  }

  get about(): string {
    const about = this.$('.bodycopy');
    const children = about.children();

    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (child.attribs.id === 'about') {
        return this.childrenToText(children[i + 1].children);
      }
    }
  }

  private childrenToText(children: any) {
  private childrenToText(children: CheerioElement[]) {
    let text = '';

    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (child.type === 'text') {
        if (!/^\s*\[\d+]\s*$/.test(child.data)) {
          text += child.data;
        }

        continue;
      }

      text += this.childrenToText(child.children);
    }

    return text;
  }
}

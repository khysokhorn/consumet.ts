import axios from 'axios';
import { load } from 'cheerio';

import { AnimeParser, IAnimeSearch } from '../../../models';

export class Gogoanime extends AnimeParser {
  protected override name = 'gogoanime';
  protected override baseUrl = 'https://gogoanime.gg';

  override async search(query: string, page: number = 1): Promise<IAnimeSearch[]> {
    const results: IAnimeSearch[] = [];
    try {
      const res = await axios.get(
        `${this.baseUrl}/search.html?keyword=${encodeURIComponent(query)}&page=${page}`
      );

      const $ = load(res.data);

      $('div.last_episodes > ul > li').each((i, el) => {
        results.push({
          animeId: $(el).find('p.name > a').attr('href')?.split('/')[2]!,
          animeTitle: $(el).find('p.name > a').attr('title')!,
          animeUrl: `${this.baseUrl}/${$(el).find('p.name > a').attr('href')}`,
          animeImage: $(el).find('div > a > img').attr('src'),
          animeReleaseDate: $(el).find('p.released').text().trim(),
        });
      });

      return results;
    } catch (err) {
      throw err;
    }
  }

  override async fetchAnimeInfo(animeUrl: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  override async fetchEpisodeSources(episodeLink: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

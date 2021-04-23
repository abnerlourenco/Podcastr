import { parseISO } from 'date-fns';
import { format } from 'date-fns';
import Image from 'next/image';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';

import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;  
}

type HomeProps = {
  latestEpisodes: Episode[]; //pode ser tambem " episodes: Array<Episode> " 
  allEpisodes: Episode[]; 
}

//para atribuir uma tipagem, basta ir na variavel.

export default function Home({latestEpisodes,allEpisodes}: HomeProps) {
  return (
    <div className={styles.homepage}>

      <section className={styles.latestEpisodes}>
        <h2>Ultimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="contain"
                />

                <div className={styles.episodeDetail}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>

          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  
                  <td style={{width: 128}}>
                    <Image  
                      width={196}
                      height={196}
                      src={episode.thumbnail} 
                      alt={episode.title}
                      objectFit="contain"
                    />
                  </td>
                  <td>
                    <a href="">{episode.title}</a>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width: 100}}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button>
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>

                </tr>
              )}
            )}            
          </tbody>
        </table>
      </section>

    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const { data } = await api.get('episodes', {
    params: {
      //parametros atribuidos na API 
      //limite de 12 episodios carregados (_limit=12)
      //ordenado pela data de publicação (_sort=published_at)
      //apresentados em ordem decrescente (_order=desc)
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      thumbnail: episode.thumbnail,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  })

  const latestEpisodes = episodes.slice(0, 2);

  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}

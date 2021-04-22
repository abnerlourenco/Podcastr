import { parseISO } from 'date-fns';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

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
  episodes: Episode[]; //pode ser tambem " episodes: Array<Episode> " 
}

//para atribuir uma tipagem, basta ir na variavel.

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
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

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  }
}

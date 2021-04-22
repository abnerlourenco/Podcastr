import { GetStaticProps } from 'next';
import { api } from '../services/api';

type Episode = {
  id: string;
  title: string;
  members: string;
  // ...
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

  const { data } = await api('episodes', {
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

  return {
    props: {
       episodes: data,
     },
     revalidate: 60 * 60 * 8,
  }
}

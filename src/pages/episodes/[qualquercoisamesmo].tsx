import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import Head from 'next/head'
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { usePlayer } from '../../contexts/playerContext';

import styles from './episode.module.scss';



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
};

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
    const { play } = usePlayer()

    return (
        <div className={styles.container}>
            
        <Head>
            <title>{episode.title} | Podcastr</title>
        </Head>

            <div className={styles.episode}>
                
                <div className={styles.thumbnailContainer}>
                    <Link href='/'>
                        <button type="button">
                            <img src="/arrow-left.svg" alt="Voltar"/>
                        </button>
                    </Link>

                    <Image
                        width={800}
                        height={400}
                        src={episode.thumbnail}
                        objectFit="cover" alt={''}                    />
                    
                    <button type="button" onClick={() => play(episode)}>
                        <img src="/play.svg" alt="Tocar episódio"/>
                    </button>
                </div>

                <header>
                    <h1>{episode.title}</h1>
                    <span>{episode.members}</span>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                </header>
                
                <div className={styles.description} 
                    dangerouslySetInnerHTML={{ __html: episode.description}}
                />
            </div>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const paths = data.map(episode => {
        return {
            params: {
                qualquercoisamesmo: episode.id
            }
        }
    })

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { qualquercoisamesmo } = ctx.params;

    const { data } = await api.get(`episodes/${qualquercoisamesmo}`)

    //console.log(data)

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        thumbnail: data.thumbnail,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    }

    return{
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24,
    }
}
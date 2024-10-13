import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css';

import { usePlayer } from "../../contexts/playerContext";

import styles from "./styles.module.scss";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import { randomInt } from "crypto";

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        stopPlay,
        playNext,
        playPrevious,
        setPlayingState,
        clearPlayerState,
        hasNext,
        hasPrevious,
        isLooping,
        isShuffling
    } = usePlayer()

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    function setupProgressLinstener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', Event => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function setStopEpisode() {
        audioRef.current.currentTime = 0;

        stopPlay();
    }

    function handleChange(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount)
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
        
    }

    const episode = episodeList[currentEpisodeIndex]

    return (
       <div className={styles.playerContainer}>
           <header>
               <img src="/playing.svg" alt="Tocando agora"/>
               <strong>Tocando agora</strong>
           </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                        width={300}
                        height={200}
                        src={episode.thumbnail}
                        objectFit="contain" alt={""}                    />

                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }

           
           <footer className={!episode ? styles.empty : ''}>
               <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleChange}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider}></div>
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                { episode && (
                    <audio 
                        src={episode.url} 
                        ref={audioRef}
                        autoPlay
                        loop={isLooping}
                        onEnded={handleEpisodeEnded}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressLinstener}
                    />
                )}

                <div className={styles.buttons}>

                    <button 
                        type="button" 
                        disabled={!episode || episodeList.length == 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>

                    <button 
                        type="button" 
                        disabled={!episode || !hasPrevious}
                        onClick={playPrevious}
                    >
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>

                    <button 
                        type="button" 
                        className={styles.playButton} 
                        disabled={!episode} 
                        onClick={togglePlay}>

                        { isPlaying 
                            ? <img src="/pause.svg" alt="Tocar"/>
                            : <img src="/play.svg" alt="Pausar"/>
                        }
                    </button>

                    <button 
                        type="button" 
                        disabled={!episode} 
                        onClick={setStopEpisode}
                    >
                        <img src="/stop-play.svg" alt="Parar"/>

                    </button>

                    <button 
                        type="button" 
                        disabled={!episode || !hasNext}
                        onClick={playNext}
                    >
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>

                    <button 
                        type="button" 
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
           </footer>
       </div>
    );
}
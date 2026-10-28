"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";

type Song = {
  id: number;
  title: string;
  artist: string;
  src: string;
};

const playlist: Song[] = [
  {
    id: 1,
    title: "Interstellar",
    artist: "Soundtrack",
    src: "/songs/Interstellar.mp3",
  },
  {
    id: 2,
    title: "Golden Brown",
    artist: "The Stranglers",
    src: "/songs/The Stranglers - Golden Brown.mp3",
  },
];

export default function Home() {
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSong = playlist[currentSongIndex];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  }, [currentSongIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const prevSong = () => {
    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length
    );
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100 p-4">
      <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-6 rounded-3xl shadow-2xl w-full max-w-sm text-center">
        <div
          className={`w-32 h-32 bg-gradient-to-tr from-amber-600 to-yellow-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-amber-500/20 text-4xl transition-all ${
            isPlaying ? "animate-spin" : ""
          }`}
        >
          🎵
        </div>

        <h2 className="text-xl font-bold tracking-wide truncate">{currentSong.title}</h2>
        <p className="text-zinc-400 text-sm mb-5">{currentSong.artist}</p>

        <audio
          ref={audioRef}
          src={currentSong.src}
          onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
          onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
          onEnded={nextSong}
        />

        <div className="mb-5">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
          <div className="flex justify-between text-xs text-zinc-500 mt-1.5 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-5 mb-6">
          <button
            onClick={prevSong}
            className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full transition"
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={togglePlay}
            className="p-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-full transition shadow-lg shadow-amber-500/30"
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </button>

          <button
            onClick={nextSong}
            className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full transition"
          >
            <SkipForward size={18} />
          </button>
        </div>

        <div className="flex items-center space-x-3 px-2 pt-3 border-t border-zinc-800/80">
          <Volume2 size={16} className="text-zinc-500" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-amber-500 cursor-pointer h-1 bg-zinc-800 rounded-lg"
          />
        </div>
      </div>
    </main>
  );
}
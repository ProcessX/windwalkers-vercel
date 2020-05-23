import {Howl, Howler} from 'howler';

import {musicRef} from "../data/musicRef.json";
import {soundEffectRef} from "../data/soundEffectRef.json";


class AudioManager {

  constructor() {
    this.value = null
    this.music = null;
    this.musicList = [];
    this.soundEffectList = [];

    for(let i = 0; i < musicRef.length - 1; i++){
      let id = musicRef[i].id
      this.musicList.push({
        id: id,
        music: new Howl({
          src: [`/assets/music/music-${id}.mp3`]
        })
      });
    }

    let landmarkRef = musicRef[musicRef.length - 1];

    for(let i = 0; i < landmarkRef.ref.length; i++){
      let id = landmarkRef.ref[i].id
      this.musicList.push({
        id: `landmark-${id}`,
        music: new Howl({
          src: [`/assets/music/music-landmark-${id}.mp3`]
        })
      });
    }

    for(let i = 0; i < soundEffectRef.length; i++){
      let id = soundEffectRef[i].id;
      this.soundEffectList.push({
        id: id,
        soundEffect: new Howl({
          src: [`/assets/soundEffect/soundEffect-${id}.wav`]
        })
      });
    }
  }



  playMusic = (id) => {
    if(this.music)
      this.music.stop();

    let newMusic = this.musicList.find((elem) => {
      if(elem.id === id)
        return elem.music;
    });

    this.music = newMusic.music;
    this.music.play();
  }


  stopMusic = () => {
    this.music.stop();
  }


  playSoundEffect = (id) => {
    for(let i = 0; i < this.soundEffectList.length; i++){
      if(this.soundEffectList[i].id === id){
        this.soundEffectList[i].soundEffect.play();
        break;
      }
    }
  }
}

export default AudioManager;
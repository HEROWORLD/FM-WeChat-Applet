class Audio {
  
  constructor(value) {
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.backgroundAudioManager.src = value.audio_api_url;
    this.backgroundAudioManager.title = value.audio_title;
    this.backgroundAudioManager.singer = "纪夏";
    this.backgroundAudioManager.coverImgUrl = value.img_url;
    this.backgroundAudioManager.webUrl = value.wxurl;
  }

}


export {Audio};
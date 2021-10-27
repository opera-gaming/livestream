const twitch = 'twitchurl'
const facebook = 'facebookurl'
const youtube = 'youtubeurl'

const twitchSetings = [
  // video codec config: low latency, adaptive bitrate
  '-c:v',
  'libx264',
  '-preset',
  'veryfast',
  '-tune',
  'zerolatency',

  // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
  '-c:a',
  'aac',
  '-strict',
  '-2',
  '-ar',
  '44100',
  '-b:a',
  '64k',

  //force to overwrite
  '-y',

  // used for audio sync
  '-use_wallclock_as_timestamps',
  '1',
  '-async',
  '1',

  //'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
  //'-strict', 'experimental',
  '-bufsize',
  '1000',
  '-f',
  'flv',
  twitch,
]

const youtubeSettings = [
  // video codec config: low latency, adaptive bitrate
  '-c:v',
  'libx264',
  '-preset',
  'veryfast',
  '-tune',
  'zerolatency',

  // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
  '-c:a',
  'aac',
  '-strict',
  '-2',
  '-ar',
  '44100',
  '-b:a',
  '64k',

  //force to overwrite
  '-y',

  // used for audio sync
  '-use_wallclock_as_timestamps',
  '1',
  '-async',
  '1',

  '-f',
  'flv',
  youtube,
]

const facebookSettings = [
  // video codec config: low latency, adaptive bitrate
  '-c:v',
  'libx264',
  '-preset',
  'veryfast',
  '-tune',
  'zerolatency',

  // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
  '-c:a',
  'aac',
  '-strict',
  '-2',
  '-ar',
  '44100',
  '-b:a',
  '64k',

  //force to overwrite
  '-y',

  // used for audio sync
  '-use_wallclock_as_timestamps',
  '1',
  '-async',
  '1',

  '-f',
  'flv',
  facebook,
]

const inputSettings = ['-i', '-']

if (twitch) {
  inputSettings.push(...twitchSetings)
}
if (facebook) {
  inputSettings.push(...facebookSettings)
}
if (youtube) {
  inputSettings.push(...youtubeSettings)
}

// console.log(inputSettings)

const ffmpegFx = () => {
  return inputSettings
}

// console.log(ffmpegFx())

const arr1 = () => {
  return [1, 2, 3, 4, 5]
}

const arr2 = () => {
  return [6, 7, 8, 9, 10]
}

console.log(arr1().concat(arr2()))

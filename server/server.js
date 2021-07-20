const child_process = require('child_process')
// To be used later for running FFmpeg
const express = require('express')
const http = require('http')
const WebSocketServer = require('ws').Server
const NodeMediaServer = require('node-media-server')
const app = express()
const cors = require('cors')
const path = require('path')
const logger = require('morgan')
require('dotenv').config()

app.use(logger('dev'))
app.use(cors())

app.use(express.json({ limit: '200mb', extended: true }))
app.use(
  express.urlencoded({ limit: '200mb', extended: true, parameterLimit: 50000 })
)

// var authRouter = require('./routes/auth')
var authRouter = require('./routes/auth')
var compareCodeRouter = require('./routes/compareCode')

// app.use('/', authRouter)
app.use('/', authRouter)
app.use('/', compareCodeRouter)

if (process.env.NODE_ENV === 'production') {
  // serve static content
  // npm run build
  app.use(express.static(path.join(__dirname, 'client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
}

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server is starting on port ${PORT}`)
})

const server = http.createServer(app).listen(3000, () => {
  console.log('Listening on PORT 3000...')
})

// Serve static files out of the www directory, where we will put our HTML page
// app.use(express.static('../www'))

const wss = new WebSocketServer({
  server: server,
})

wss.on('connection', (ws, req) => {
  // Ensure that the URL starts with '/rtmp/', and extract the target RTMP URL.
  // let match
  // console.log(match)
  // if (!(match = req.url.match(/^\/rtmp\/(.*)$/))) {
  //   ws.terminate() // No match, reject the connection.
  //   return
  // }

  // Launch FFmpeg to handle all appropriate transcoding, muxing, and RTMP.
  // If 'ffmpeg' isn't in your path, specify the full path to the ffmpeg binary.
  const ffmpeg = child_process.spawn('ffmpeg', [
    // Facebook requires an audio track, so we create a silent one here.
    // Remove this line, as well as `-shortest`, if you send audio from the browser.
    // '-f',
    // 'lavfi',
    // '-i',
    // 'anullsrc',

    // FFmpeg will read input video from STDIN
    '-i',
    '-',

    // '-c',
    // 'copy',
    // '-f',
    // 'flv',
    // `${process.env.FACEBOOK_STREAM_ADDRESS}`,
    // '-c:v',
    // 'libx264',
    // '-preset',
    // 'medium',
    // '-maxrate',
    // '3500k',
    // '-bufsize',
    // '6000k',
    // '-r',
    // '30',
    // '-pix_fmt',
    // 'yuv420p',
    // '-g',
    // '60',
    // '-c:a',
    // 'aac',
    // '-b:a',
    // '160k',
    // '-ac',
    // '2',
    // '-ar',
    // '44100',
    // '-f',
    // 'flv',
    // `${process.env.TWITCH_STREAM_ADDRESS}`,

    '-filter_complex',
    '[0:v]scale=-2:1080,fps=30,split=outputs=2[1080a][1080b];[0:v]scale=-2:720,fps=30,split=outputs=2[720a][720b]',
    '-map',
    '[1080a]',
    '-map',
    '[1080b]',
    '-map',
    '[720a]',
    '-map',
    '[720b]',
    '-map',
    '0:a?',
    '-c:v',
    'libx264',
    '-c:a',
    'aac',
    '-preset',
    'veryfast',
    '-g',
    '60',
    '-b:v',
    '3000k',
    '-maxrate',
    '3000k',
    '-bufsize',
    '6000k',
    '-f',
    'tee',
    `[select=\'v:0,a\':f=flv:onfail=ignore]${process.env.TWITCH_STREAM_ADDRESS}`,
    `[select=\'v:1,a\':f=flv:onfail=ignore]${process.env.YOUTUBE_STREAM_ADDRESS}`,
    `[select=\'v:2,a\':f=flv:onfail=ignore]${process.env.FACEBOOK_STREAM_ADDRESS}`,
    // "[select='v:3,a':f=flv:onfail=ignore]rtmp://destination4.example/live2/<key>\"",
  ])

  // If FFmpeg stops for any reason, close the WebSocket connection.
  ffmpeg.on('close', (code, signal) => {
    console.log(
      'FFmpeg child process closed, code ' + code + ', signal ' + signal
    )
    ws.terminate()
  })

  // Handle STDIN pipe errors by logging to the console.
  // These errors most commonly occur when FFmpeg closes and there is still
  // data to write.  If left unhandled, the server will crash.
  ffmpeg.stdin.on('error', (e) => {
    console.log('FFmpeg STDIN Error', e)
  })

  // FFmpeg outputs all of its messages to STDERR.  Let's log them to the console.
  ffmpeg.stderr.on('data', (data) => {
    console.log('FFmpeg STDERR:', data.toString())
  })

  // When data comes in from the WebSocket, write it to FFmpeg's STDIN.
  ws.on('message', (msg) => {
    console.log('DATA', msg)
    ffmpeg.stdin.write(msg)
  })

  // If the client disconnects, stop FFmpeg.
  ws.on('close', (e) => {
    console.log('kill: SIGINT')
    ffmpeg.kill('SIGINT')
  })
})

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: '*',
  },
}

var nms = new NodeMediaServer(config)
nms.run()

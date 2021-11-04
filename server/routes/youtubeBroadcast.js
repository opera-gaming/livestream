const express = require('express'),
  bindYoutubeBroadcastToStream = require('../utils/bindYoutubeBroadcastToStream'),
  createYoutubeBroadcast = require('../utils/createYoutubeBroadcast'),
  createYoutubeStream = require('../utils/createYoutubeStream'),
  router = express.Router(),
  { default: axios } = require('axios')
require('dotenv').config()

router.post('/api/youtube/broadcast', async (req, res) => {
  // youtube api create broadcast

  const {
    youtubeBroadcastTitle,
    youtubeBroadcastDescription,
    youtubePrivacyPolicy,
    youtubeAccessToken,
  } = req.body

  const youtubeBroadcastId = await createYoutubeBroadcast(
    youtubeBroadcastTitle,
    youtubeBroadcastDescription,
    youtubePrivacyPolicy,
    youtubeAccessToken
  )

  let youtubeStream = await createYoutubeStream(
    youtubeBroadcastTitle,
    youtubeBroadcastDescription,
    youtubeAccessToken
  )

  // console.log(youtubeStream)
  // console.log(youtubeStream.id)
  // console.log(youtubeStream.youtubeDestinationUrl)

  await bindYoutubeBroadcastToStream(
    youtubeBroadcastId,
    youtubeStream.id,
    youtubeAccessToken
  )

  return res.status(200).send({
    youtubeDestinationUrl: youtubeStream.youtubeDestinationUrl,
    youtubeBroadcastId: youtubeBroadcastId,
    youtubeStreamId: youtubeStream.id,
  })
})

router.post('/api/youtube/broadcast/live', async (req, res) => {
  console.log('transition youtube to live')

  const { youtubeBroadcastId, youtubeAccessToken } = req.body

  const config = {
    headers: {
      Authorization: `Bearer ${youtubeAccessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }

  axios.post(
    `https://youtube.googleapis.com/youtube/v3/liveBroadcasts/transition?broadcastStatus=live&id=${youtubeBroadcastId}&part=id%2Csnippet%2CcontentDetails%2Cstatus&key=${process.env.GOOGLE_API_KEY}`,
    config
  )

  // ADD RETURN STATEMENT
})

router.post('/api/youtube/broadcast/end', async (req, res) => {
  console.log('transition youtube to end')

  const { youtubeBroadcastId, youtubeAccessToken } = req.body

  const config = {
    headers: {
      Authorization: `Bearer ${youtubeAccessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }

  axios.post(
    `https://youtube.googleapis.com/youtube/v3/liveBroadcasts/transition?broadcastStatus=complete&id=${youtubeBroadcastId}&part=id%2Csnippet%2CcontentDetails%2Cstatus&key=${process.env.GOOGLE_API_KEY}`,
    config
  )

  // ADD RETURN STATEMENT
})

module.exports = router
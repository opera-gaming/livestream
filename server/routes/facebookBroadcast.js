const express = require('express'),
  router = express.Router(),
  pool = require('../db'),
  { default: axios } = require('axios')
require('dotenv').config()

router.post('/api/facebook/broadcast', async (req, res) => {
  let authorizationCode = req.body.authorizationCode
  let authData = await axios
    .post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_SECRET}&code=${authorizationCode}&grant_type=authorization_code&redirect_uri=${process.env.TWITCH_REDIRECT_URL}`
    )
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.log(err)
    })

  return res.send(authData)
})

module.exports = router
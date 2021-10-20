const express = require('express'),
  router = express.Router(),
  pool = require('../db')

router.post('/api/broadcasts', (req, res, next) => {
  let timeCreated = new Date().toUTCString()
  const values = [
    req.body.youtubeTitle,
    req.body.youtubeDescription,
    req.body.youtubePrivacyPolicy,
    timeCreated,
    req.body.youtubeDestinationUrl,
    req.body.userId,
    req.body.broadcastId,
    req.body.streamId,
  ]

  pool.query(
    `INSERT INTO broadcasts (youtube_title, youtube_description, youtube_privacy_policy, broadcast_time_created, youtube_destination_url, user_id, broadcast_id, stream_id)
		VALUES($1, $2, $3, $4, $5, $6 ,$7, $8)`,
    values,
    (q_err, q_res) => {
      if (q_err) return next(q_err)
      res.json(q_res.rows)
    }
  )
})

router.get('/api/broadcasts', async (req, res) => {
  const userId = req.body.userId

  let results = await pool.query(
    `SELECT * FROM broadcasts WHERE user_id = $1`,
    [userId]
  )
  if (results.rows) {
    res.send(results.rows[0])
  }
})

module.exports = router
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { html } from 'hono/html'
import type { FrameSignaturePacket } from './types'

const app = new Hono()

app.get('/', (c) => {
  const frameImage = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThce0ASD7AixM9W5Nv_H4MDCPGZzefXp4b9LcV2hAyHw&s`
  const framePostUrl = c.req.url

  return c.html(html`
    <html lang="en">
      <head>
        <meta property="og:image" content="${frameImage}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${frameImage}" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:post_url" content="${framePostUrl}" />
        <meta property="fc:frame:button:1" content="START" />
        <title>Farcaster Frames</title>
      </head>
      <body>
        <h1>Hello Farcaster!</h1>
      </body>
    </html>
  `)
})

app.post('/', async (c) => {
  try {
    const body = await c.req.json<FrameSignaturePacket>()
    const { buttonIndex, inputText } = body.untrustedData

    const imageText = encodeURIComponent(inputText || 'Hello World')

    let frameImage
    if (buttonIndex == 3){
      frameImage = `https://dummyimage.com/600x400/000/fff&text=${imageText}`
    }else {
      frameImage = `https://img.buzzfeed.com/buzzfeed-static/static/2015-04/29/17/campaign_images/webdr04/can-you-guess-the-harry-potter-character-by-these-2-21280-1430343220-10_dblbig.jpg`
    }
    const framePostUrl = c.req.url

    return c.html(html`
      <html lang="en">
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${frameImage}" />
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
          <meta property="fc:frame:post_url" content="${framePostUrl}" />
          <meta property="fc:frame:input:text" content="Enter a message" />
          <meta property="fc:frame:button:1" content="Thor" />
          <meta property="fc:frame:button:2" content="Spiderman" />
          <meta property="fc:frame:button:3" content="niggerman" />
          <meta property="fc:frame:button:4" content="Tohm hanks" />
          <title>Farcaster Frames</title>
        </head>
      </html>
    `)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Invalid request' }, 400)
  }
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})

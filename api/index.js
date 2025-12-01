export default function handler(req, res) {
  res.status(200).json({ 
    status: '🤖 Monad Sniper Bot API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      bot: '/api/bot',
      health: '/api/health'
    },
    instructions: {
      setWebhook: 'POST https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=https://your-project.vercel.app/api/bot'
    }
  });
}
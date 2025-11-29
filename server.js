const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

let conversations = [];

app.post('/save', (req, res) => {
  conversations.push(req.body);
  res.json({ status: 'ok' });
});

app.post('/ai', async (req, res) => {
  const question = req.body.question;
  try {
    const aiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        input: `أنت مساعد صحي بالعربية. السؤال: "${question}". قدم نصائح آمنة وطمأنة بدون وصفات دقيقة.`
      })
    });
    const data = await aiRes.json();
    const answer = data.output_text || 'عذرًا، لم أتمكن من توليد الرد.';
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.json({ answer: 'حدث خطأ أثناء توليد الرد.' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

const chat = document.getElementById('chat');
let userSymptoms = [];
let conversationHistory = [];

function addMessage(sender, text) {
  const p = document.createElement('p');
  p.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;
}

function addSymptom() {
  const symp = document.getElementById('symptoms').value.trim();
  if (!symp) return;
  userSymptoms.push(symp);
  addMessage('النظام', `تم إضافة العرض: ${symp}`);
  document.getElementById('symptoms').value = '';
}

async function sendQuestion() {
  const input = document.getElementById('userInput').value.trim();
  if (!input) return;
  addMessage('أنت', input);
  addMessage('طمني AI', 'حاليًا لا يوجد وكيل متاح للرد. استخدم "استشارة فورية AI".');
  conversationHistory.push({user: input, ai: null});
  await fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: input, symptoms: userSymptoms })
  });
  document.getElementById('userInput').value = '';
}

async function aiResponse() {
  const input = document.getElementById('userInput').value.trim();
  const query = input || "الأعراض: " + userSymptoms.join(", ");
  if (!query) return;

  addMessage('أنت', query);
  addMessage('طمني AI', 'جارٍ معالجة سؤالك...');

  try {
    const response = await fetch('/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: query })
    });
    const data = await response.json();
    chat.lastChild.remove();
    addMessage('طمني AI', data.answer);
    conversationHistory.push({user: query, ai: data.answer});
  } catch (err) {
    chat.lastChild.remove();
    addMessage('طمني AI', 'حدث خطأ أثناء توليد الرد. حاول مرة أخرى.');
    console.error(err);
  }

  document.getElementById('userInput').value = '';
}

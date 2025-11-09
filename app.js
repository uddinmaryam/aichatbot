
    // --- Utilities
    const el = sel => document.querySelector(sel);
    const messagesEl = el('#messages');
    const form = el('#typing-form');
    const input = el('#prompt');
    const STORAGE_KEY = 'mini-chatgpt-history-v1';

    function saveHistory(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
    function loadHistory(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }

    function scrollToBottom(){ messagesEl.scrollTop = messagesEl.scrollHeight; }

    // --- Rendering
    function renderMessage({ role, content, time }) {
      const row = document.createElement('div');
      row.className = `row ${role}`;
      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      avatar.textContent = role === 'user' ? 'U' : 'AI';
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.innerText = content;
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.innerText = time || new Date().toLocaleTimeString();
      const side = document.createElement('div');
      side.style.display = 'flex'; side.style.flexDirection = 'column';
      side.appendChild(bubble); side.appendChild(meta);

      if(role === 'user'){ row.appendChild(side); row.appendChild(avatar); }
      else { row.appendChild(avatar); row.appendChild(side); }

      messagesEl.appendChild(row);
      scrollToBottom();
    }

    function renderTyping() {
      const row = document.createElement('div');
      row.className = 'row ai';
      row.id = 'typing-row';
      row.innerHTML = `
        <div class="avatar">AI</div>
        <div class="bubble"><span class="typing">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        </span></div>`;
      messagesEl.appendChild(row);
      scrollToBottom();
    }
    function removeTyping(){ const n = el('#typing-row'); if(n) n.remove(); }

    // --- Fake AI (rule-based so it works offline)
    function fakeAIResponse(prompt){
      const p = prompt.trim().toLowerCase();
      if(!p) return "Say something and I'll respond.";
      if(p.includes('hello') || p.includes('hi')) return "Hey! What are you building today?";
      if(p.startsWith('explain ')) return "Try breaking it down: definition → tiny example → one sentence summary.";
      if(p.includes('css')) return "Focus on layout first: flexbox/grid. Then spacing, then typography. Colors last.";
      if(p.includes('javascript') || p.includes('js')) return "Master array methods (map/filter/reduce) and events. The rest compounds.";
      if(p.includes('help')) return "Tell me the exact error or paste the snippet. I'll pinpoint it.";
      if(p.includes('clear')) return "[Type: /clear] to wipe the chat.";
      // default: short reflective echo
      return `You said: “${prompt}”. Want me to turn that into a step-by-step plan?`;
    }

    // --- State & init
    let history = loadHistory();
    if(history.length === 0){
      const welcome = { role:'ai', content:"Welcome! I’m your tiny ChatGPT clone. Ask me anything, and I'll reply. (Everything is saved locally.)" };
      history.push({ ...welcome, time: new Date().toLocaleTimeString() });
      saveHistory(history);
    }
    history.forEach(renderMessage);

    // --- Events
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const prompt = input.value;
      if(!prompt.trim()) return;

      // Commands
      if(prompt.trim() === '/clear'){
        history = [];
        saveHistory(history);
        messagesEl.innerHTML = '';
        renderMessage({ role:'ai', content:'Chat cleared.', time:new Date().toLocaleTimeString() });
        input.value = '';
        return;
      }

      const userMsg = { role:'user', content: prompt, time: new Date().toLocaleTimeString() };
      history.push(userMsg);
      renderMessage(userMsg);
      input.value = '';

      renderTyping();
      setTimeout(() => {
        removeTyping();
        const aiText = fakeAIResponse(prompt);
        const aiMsg = { role:'ai', content: aiText, time: new Date().toLocaleTimeString() };
        history.push(aiMsg);
        saveHistory(history);
        renderMessage(aiMsg);
      }, 700);
    });

    // Enter to send on focused input (form already handles it, but this keeps UX snappy)
    input.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' && !e.shiftKey){
        // prevent accidental newline in single-line input
      }
    });

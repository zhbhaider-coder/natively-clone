/* Natively clone — live copilot demo.
   BYOK only: keys live in localStorage, never in code, never on our servers.
   Mic: Web Speech API (Chrome/Edge). AI: Gemini or OpenAI, direct from browser.
   FIX 2026-10-27: the mic used to answer only when speech looked like a
   question ("?" or a WH-word). A live copilot answers whatever the other
   person says — "search client" included — so every committed sentence now
   gets an answer. A "Test key" button proves the key works, and every
   element lookup is guarded so one missing element can never kill the demo. */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  // Safe helpers: a missing element logs a warning instead of throwing.
  function on(id, evt, fn) { var e = $(id); if (e) e.addEventListener(evt, fn); else if (window.console) console.warn('demo: missing #' + id); }
  function setText(id, text) { var e = $(id); if (e) e.textContent = text; }
  var GEMINI_KEY = 'natively_clone_gemini_key';
  var OPENAI_KEY = 'natively_clone_openai_key';
  var CTX_KEY = 'natively_clone_context';

  var transcript = [];        // {who, text, time}
  var lastQuestion = '';
  var listening = false;
  var recog = null;
  var micLevelTimer = null;
  var finalBuffer = '';       // uncommitted final speech
  var commitTimer = null;     // debounce timer for committing speech

  // ---------- mode presets from URL (?mode=technical) ----------
  var params = new URLSearchParams(location.search);
  var modeParam = params.get('mode');
  if (modeParam) {
    var sel = $('mode');
    if (sel) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === modeParam) { sel.value = modeParam; break; }
      }
    }
  }

  // ---------- keys ----------
  function getProvider() { var p = $('provider'); return p ? p.value : 'gemini'; }
  function refreshKeyStatus() {
    var has = (getProvider() === 'gemini' ? localStorage.getItem(GEMINI_KEY) : localStorage.getItem(OPENAI_KEY));
    var el = $('keyStatus');
    if (!el) return;
    el.textContent = has ? 'Key saved ✓' : 'No key saved';
    el.className = 'status' + (has ? ' live' : '');
  }
  function saveKeys() {
    var g = $('geminiKey'), o = $('openaiKey');
    if (g && g.value.trim()) localStorage.setItem(GEMINI_KEY, g.value.trim());
    if (o && o.value.trim()) localStorage.setItem(OPENAI_KEY, o.value.trim());
    if (g) g.value = ''; if (o) o.value = '';
    refreshKeyStatus();
    setStatus('Keys saved in this browser only.', '');
  }
  function clearKeys() {
    localStorage.removeItem(GEMINI_KEY); localStorage.removeItem(OPENAI_KEY);
    var g = $('geminiKey'), o = $('openaiKey');
    if (g) g.value = ''; if (o) o.value = '';
    refreshKeyStatus();
    setStatus('Keys cleared.', '');
  }
  function getKey() {
    return getProvider() === 'gemini'
      ? localStorage.getItem(GEMINI_KEY)
      : localStorage.getItem(OPENAI_KEY);
  }
  function testKey() {
    var key = getKey();
    var statusEl = $('keyStatus');
    if (!key) {
      if (statusEl) { statusEl.textContent = 'No key saved — paste a key and tap Save keys first.'; statusEl.className = 'status'; }
      setStatus('No key to test — paste a key first.', 'err');
      return;
    }
    if (statusEl) { statusEl.textContent = 'Testing key…'; statusEl.className = 'status'; }
    var url, body, headers;
    if (getProvider() === 'gemini') {
      url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(key);
      headers = { 'Content-Type': 'application/json' };
      body = JSON.stringify({ contents: [{ parts: [{ text: 'Reply with exactly: OK' }] }] });
    } else {
      url = 'https://api.openai.com/v1/chat/completions';
      headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key };
      body = JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'Reply with exactly: OK' }], max_tokens: 10 });
    }
    fetch(url, { method: 'POST', headers: headers, body: body })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, json: j }; }); })
      .then(function (res) {
        if (!res.ok) {
          var msg = (res.json.error && (res.json.error.message || res.json.error.status)) || ('HTTP ' + res.status);
          if (statusEl) { statusEl.textContent = 'Key failed: ' + msg; statusEl.className = 'status err'; }
          setStatus('Key test failed: ' + msg, 'err');
        } else {
          if (statusEl) { statusEl.textContent = 'Key works ✓'; statusEl.className = 'status live'; }
          setStatus('Key works — the copilot can answer.', 'live');
        }
      })
      .catch(function (e) {
        if (statusEl) { statusEl.textContent = 'Key test error: ' + e.message; statusEl.className = 'status err'; }
        setStatus('Key test error: ' + e.message, 'err');
      });
  }
  on('saveKeys', 'click', saveKeys);
  on('clearKeys', 'click', clearKeys);
  on('testKey', 'click', testKey);
  on('provider', 'change', refreshKeyStatus);
  refreshKeyStatus();

  // ---------- context persistence ----------
  function saveCtx() {
    try {
      var m = $('mode'), j = $('jd'), r = $('resume');
      localStorage.setItem(CTX_KEY, JSON.stringify({
        mode: m ? m.value : 'general', jd: j ? j.value : '', resume: r ? r.value : ''
      }));
    } catch (e) { /* storage full/blocked — demo still works in-session */ }
  }
  function loadCtx() {
    try {
      var c = JSON.parse(localStorage.getItem(CTX_KEY) || 'null');
      if (c) {
        var m = $('mode'), j = $('jd'), r = $('resume');
        if (m) m.value = c.mode || 'general';
        if (j) j.value = c.jd || '';
        if (r) r.value = c.resume || '';
      }
    } catch (e) {}
  }
  ['mode', 'jd', 'resume'].forEach(function (id) { on(id, 'input', saveCtx); });
  loadCtx();

  // ---------- transcript ----------
  function timeNow() {
    var d = new Date();
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
  }
  function addLine(who, text, isQuestion) {
    transcript.push({ who: who, text: text, time: timeNow() });
    var log = $('log');
    if (!log) return;
    if (log.querySelector('.muted') && transcript.length === 1) log.innerHTML = '';
    var div = document.createElement('div');
    div.className = 'line' + (isQuestion ? ' q-line' : '');
    var whoSpan = document.createElement('span'); whoSpan.className = 'who'; whoSpan.textContent = who + ': ';
    var tSpan = document.createElement('span'); tSpan.className = 't'; tSpan.textContent = timeNow();
    div.appendChild(tSpan); div.appendChild(whoSpan);
    div.appendChild(document.createTextNode(text));
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }
  function setStatus(text, cls) {
    var el = $('micStatus');
    if (!el) return;
    el.textContent = text;
    el.className = 'status' + (cls ? ' ' + cls : '');
  }

  // ---------- question detection (highlighting only — never a gate) ----------
  var WH = /^(who|what|when|where|why|how|which|can|could|would|should|do|does|did|is|are|was|were|tell|describe|explain|walk|give|share|have you|have you ever)\b/i;
  function looksLikeQuestion(text) {
    var t = text.trim();
    return t.indexOf('?') !== -1 || WH.test(t);
  }

  // ---------- AI ----------
  function buildSystemPrompt() {
    var modeEl = $('mode'), jdEl = $('jd'), resumeEl = $('resume');
    var mode = modeEl ? modeEl.value : 'general';
    var jd = jdEl ? jdEl.value.trim() : '';
    var resume = resumeEl ? resumeEl.value.trim() : '';
    var recent = transcript.slice(-8).map(function (l) { return l.who + ': ' + l.text; }).join('\n');
    var modeLine = {
      general: 'Answer naturally and helpfully, in a calm, confident tone.',
      technical: 'Answer like a senior engineer: clarify scope, reason out loud, structure the answer, name trade-offs, then give the concrete approach. Keep it concise enough to speak in under a minute.',
      sales: 'Answer like a top salesperson: discovery question first, value before price, handle objections with empathy, end with a clear next step.',
      recruiting: 'Answer like an experienced recruiter: assess fit against the role, ask one sharp follow-up, keep it professional.',
      jobsearch: 'Answer like a strong job candidate: ground every answer in the resume provided, use the STAR structure, keep it to 40–60 seconds spoken.',
      team: 'Capture decisions, owners, and next steps. Answer concisely and flag anything that needs a follow-up.',
      lecture: 'Explain clearly, like a great lecturer: one idea at a time, with a short example.',
      seminar: 'Offer a thoughtful discussion point, then a question back to the room.',
      callcenter: 'Be empathetic, confirm understanding, give the next concrete step, and offer help beyond the question.'
    }[mode] || 'Answer helpfully and concisely.';
    return 'You are a real-time AI copilot helping the user during a live conversation. '
      + modeLine + ' '
      + 'Give a short spoken-style answer the user can say immediately (aim for 40–60 seconds spoken, ~120 words max). '
      + 'No preamble like "Here is an answer". No filler. '
      + (jd ? 'Job description:\n' + jd + '\n' : '')
      + (resume ? 'User background / resume:\n' + resume + '\n' : '')
      + 'Recent conversation:\n' + recent + '\n'
      + 'Answer the latest question.';
  }

  function callAI(question) {
    var key = getKey();
    if (!key) {
      setText('answerBox', 'Add your API key first (section 1) — Gemini keys are free at aistudio.google.com. Keys stay in your browser only.');
      setText('latency', 'no key');
      return Promise.resolve(null);
    }
    setText('answerBox', 'Thinking…');
    setText('latency', '…');
    var t0 = performance.now();
    var prompt = buildSystemPrompt() + '\nLatest question: ' + question;
    var url, body, headers;
    if (getProvider() === 'gemini') {
      url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(key);
      headers = { 'Content-Type': 'application/json' };
      body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });
    } else {
      url = 'https://api.openai.com/v1/chat/completions';
      headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key };
      body = JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 400, temperature: 0.7 });
    }
    return fetch(url, { method: 'POST', headers: headers, body: body })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, json: j }; }); })
      .then(function (res) {
        var secs = ((performance.now() - t0) / 1000).toFixed(1);
        if (!res.ok) {
          var msg = (res.json.error && (res.json.error.message || res.json.error.status)) || ('HTTP ' + res.status);
          setText('answerBox', 'The AI call failed: ' + msg + '. Check the key and try again.');
          setText('latency', 'error');
          return null;
        }
        var text = '';
        if (getProvider() === 'gemini') {
          text = (((res.json.candidates || [])[0] || {}).content || {}).parts
            ? res.json.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join('') : '';
        } else {
          text = (((res.json.choices || [])[0] || {}).message || {}).content || '';
        }
        text = (text || '').trim() || '(Empty answer — try again.)';
        setText('answerBox', text);
        setText('latency', 'answered in ' + secs + 's');
        return text;
      })
      .catch(function (e) {
        setText('answerBox', 'Network error calling the AI: ' + e.message);
        setText('latency', 'error');
        return null;
      });
  }

  function handleQuestion(text) {
    lastQuestion = text;
    addLine('Interviewer', text, true);
    callAI(text);
  }

  // Commit one spoken turn and ALWAYS answer it — a live copilot responds to
  // whatever the other person says, question or not ("search client" included).
  function commitSpeech() {
    commitTimer = null;
    var said = (finalBuffer || '').trim();
    finalBuffer = '';
    if (!said) return;
    addLine('You', said, looksLikeQuestion(said));
    lastQuestion = said;
    callAI(said);
  }

  // ---------- mic (Web Speech API) ----------
  function startListening() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setStatus('Mic not supported in this browser — use Chrome/Edge, or type questions below.', 'err');
      return;
    }
    recog = new SR();
    recog.lang = 'en-US';
    recog.continuous = true;
    recog.interimResults = true;
    recog.onresult = function (ev) {
      var interim = '';
      for (var i = ev.resultIndex; i < ev.results.length; i++) {
        var res = ev.results[i];
        if (res.isFinal) {
          var text = res[0].transcript.trim();
          if (text) {
            finalBuffer += (finalBuffer ? ' ' : '') + text;
            // Commit on sentence end, or shortly after speech pauses — never sit silent.
            if (/[?.!]$/.test(text) || finalBuffer.length > 160) {
              if (commitTimer) { clearTimeout(commitTimer); commitTimer = null; }
              commitSpeech();
            } else if (!commitTimer) {
              commitTimer = setTimeout(commitSpeech, 1200);
            }
          }
        } else {
          interim += res[0].transcript;
        }
      }
      setText('interim', interim ? 'Hearing: ' + interim : '');
    };
    recog.onerror = function (ev) {
      if (ev.error === 'not-allowed') setStatus('Mic blocked — allow microphone access and try again.', 'err');
      else if (ev.error !== 'no-speech') setStatus('Mic error: ' + ev.error, 'err');
    };
    recog.onend = function () {
      if (listening) { try { recog.start(); } catch (e) {} } // keep going
    };
    try { recog.start(); } catch (e) { setStatus('Could not start mic: ' + e.message, 'err'); return; }
    listening = true;
    var sb = $('startBtn'), tb = $('stopBtn');
    if (sb) sb.disabled = true; if (tb) tb.disabled = false;
    setStatus('● Listening… speak anything — the copilot answers every line.', 'live');
    // Fake-but-honest level meter: animates while listening (real level API needs getUserMedia).
    micLevelTimer = setInterval(function () {
      var bar = $('micBar');
      if (bar) bar.style.width = (20 + Math.random() * 60) + '%';
    }, 300);
  }
  function stopListening() {
    // Answer anything still buffered before going quiet.
    if (commitTimer) { clearTimeout(commitTimer); commitTimer = null; }
    if (listening) commitSpeech();
    listening = false;
    if (recog) { try { recog.stop(); } catch (e) {} }
    if (micLevelTimer) { clearInterval(micLevelTimer); var bar = $('micBar'); if (bar) bar.style.width = '0%'; }
    var sb = $('startBtn'), tb = $('stopBtn');
    if (sb) sb.disabled = false; if (tb) tb.disabled = true;
    setStatus('Mic idle', '');
    setText('interim', '');
  }
  on('startBtn', 'click', startListening);
  on('stopBtn', 'click', stopListening);

  // ---------- simulate interviewer ----------
  function askTyped() {
    var inp = $('simInput');
    if (!inp) return;
    var v = inp.value.trim();
    if (!v) return;
    inp.value = '';
    handleQuestion(v);
  }
  on('askBtn', 'click', askTyped);
  on('simInput', 'keydown', function (e) { if (e.key === 'Enter') askTyped(); });
  on('answerBtn', 'click', function () {
    if (lastQuestion) callAI(lastQuestion);
    else if (transcript.length) { lastQuestion = transcript[transcript.length - 1].text; callAI(lastQuestion); }
    else setText('answerBox', 'No question yet — speak or type one first.');
  });
  on('copyAnswer', 'click', function () {
    var ab = $('answerBox');
    if (navigator.clipboard && ab) navigator.clipboard.writeText(ab.textContent);
    var b = $('copyAnswer');
    if (b) { b.textContent = 'Copied ✓'; setTimeout(function () { b.textContent = 'Copy answer'; }, 1500); }
  });
  on('copyNotes', 'click', function () {
    var nb = $('notesBox');
    if (navigator.clipboard && nb) navigator.clipboard.writeText(nb.textContent);
    var b = $('copyNotes');
    if (b) { b.textContent = 'Copied ✓'; setTimeout(function () { b.textContent = 'Copy notes'; }, 1500); }
  });

  // ---------- summarize ----------
  on('summarizeBtn', 'click', function () {
    if (transcript.length === 0) {
      setText('notesBox', 'No transcript yet — have a conversation first.');
      return;
    }
    stopListening();
    var key = getKey();
    var full = transcript.map(function (l) { return '[' + l.time + '] ' + l.who + ': ' + l.text; }).join('\n');
    if (!key) {
      setText('notesBox', 'Add your API key first (section 1) to generate the summary. Full transcript:\n\n' + full);
      return;
    }
    setText('notesBox', 'Summarizing…');
    var prompt = 'Summarize this meeting/interview transcript into: (1) a 3–5 line summary, (2) key points as bullets, (3) action items as bullets with owners where mentioned.\n\nTranscript:\n' + full;
    var url, body, headers;
    if (getProvider() === 'gemini') {
      url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(key);
      headers = { 'Content-Type': 'application/json' };
      body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });
    } else {
      url = 'https://api.openai.com/v1/chat/completions';
      headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key };
      body = JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 600, temperature: 0.5 });
    }
    fetch(url, { method: 'POST', headers: headers, body: body })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var text = '';
        if (getProvider() === 'gemini') {
          text = (((j.candidates || [])[0] || {}).content || {}).parts
            ? j.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join('') : '';
        } else {
          text = (((j.choices || [])[0] || {}).message || {}).content || '';
        }
        setText('notesBox', (text || '').trim() || '(Empty summary — try again.)');
      })
      .catch(function (e) { setText('notesBox', 'Summary failed: ' + e.message); });
  });

  // ---------- download ----------
  on('downloadBtn', 'click', function () {
    var full = transcript.map(function (l) { return '[' + l.time + '] ' + l.who + ': ' + l.text; }).join('\n');
    var blob = new Blob([full || 'No transcript yet.'], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'natively-clone-transcript.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  window.addEventListener('beforeunload', stopListening);
})();

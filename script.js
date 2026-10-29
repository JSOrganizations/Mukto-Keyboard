function showToast(msg) {
        const toast = document.getElementById('toastMsg');
        toast.innerHTML = `<svg class="icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> <span>${msg}</span>`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }

    function switchStudioTab(tabId, btn) {
        const tabs = document.querySelectorAll('.studio-tab-btn');
        tabs.forEach(t => t.classList.remove('active'));
        if (btn) btn.classList.add('active');

        const panels = document.querySelectorAll('.studio-panel');
        panels.forEach(p => p.classList.remove('active'));
        const targetPanel = document.getElementById('panel-' + tabId);
        if (targetPanel) targetPanel.classList.add('active');
    }

    let activeCarrierEmoji = '😎';
    let activeSecretText = 'কাল বিকেল ৪টায় ধানমন্ডি লেকে দেখা করব 🤫';
    let currentPerspective = 'mukto';
    let chatAnimTimeouts = [];

    function clearChatTimeouts() {
        chatAnimTimeouts.forEach(t => clearTimeout(t));
        chatAnimTimeouts = [];
    }

    function selectChatCarrier(emoji, btn) {
        activeCarrierEmoji = emoji;
        const chips = document.querySelectorAll('.chat-carrier-chip');
        chips.forEach(c => c.classList.remove('active'));
        if (btn) btn.classList.add('active');

        const bEmoji = document.getElementById('chatBubbleCarrierEmoji');
        if (bEmoji) bEmoji.innerText = emoji;
    }

    function setChatPerspective(mode) {
        currentPerspective = mode;
        const btnM = document.getElementById('btnViewMukto');
        const btnO = document.getElementById('btnViewOutside');
        if (btnM) btnM.classList.toggle('active', mode === 'mukto');
        if (btnO) btnO.classList.toggle('active', mode === 'outside');

        const revLayer = document.getElementById('chatRevealedLayer');
        if (revLayer) {
            revLayer.style.display = (mode === 'mukto') ? 'block' : 'none';
        }
    }

    function runTwoPersonChatSequence() {
        clearChatTimeouts();

        const msg2 = document.getElementById('chatMsg2');
        const typingRow = document.getElementById('chatTypingIndicatorRow');
        const msg3 = document.getElementById('chatMsg3');
        const revLayer = document.getElementById('chatRevealedLayer');
        const carrierEl = document.getElementById('chatBubbleCarrierEmoji');
        const revTextEl = document.getElementById('chatRevealedContentText');
        const area = document.getElementById('chatMessagesArea');

        if (msg2) {
            msg2.style.display = 'none';
            msg2.style.opacity = '0';
        }
        if (typingRow) typingRow.style.display = 'none';
        if (msg3) {
            msg3.style.display = 'none';
            msg3.style.opacity = '0';
        }
        if (revLayer) {
            revLayer.style.display = 'none';
            revLayer.style.opacity = '0';
        }

        if (carrierEl) carrierEl.innerText = activeCarrierEmoji;
        if (revTextEl) revTextEl.innerText = activeSecretText;

        chatAnimTimeouts.push(setTimeout(() => {
            if (msg2) {
                msg2.style.display = 'flex';
                msg2.style.animation = 'slideInSent 0.4s ease forwards';
                if (area) area.scrollTop = area.scrollHeight;
            }

            chatAnimTimeouts.push(setTimeout(() => {
                if (revLayer && currentPerspective === 'mukto') {
                    revLayer.style.display = 'block';
                    revLayer.style.animation = 'fadeInRevealed 0.45s ease forwards';
                    if (area) area.scrollTop = area.scrollHeight;
                }

                chatAnimTimeouts.push(setTimeout(() => {
                    if (typingRow) {
                        typingRow.style.display = 'flex';
                        if (area) area.scrollTop = area.scrollHeight;
                    }

                    chatAnimTimeouts.push(setTimeout(() => {
                        if (typingRow) typingRow.style.display = 'none';
                        if (msg3) {
                            msg3.style.display = 'flex';
                            msg3.style.animation = 'slideInReceived 0.4s ease forwards';
                            if (area) area.scrollTop = area.scrollHeight;
                        }

                        chatAnimTimeouts.push(setTimeout(() => {
                            runTwoPersonChatSequence();
                        }, 8000));
                    }, 2000));
                }, 1400));
            }, 900));
        }, 800));
    }

    function replayChatConversation() {
        runTwoPersonChatSequence();
    }

    function triggerUserSendSecretChat() {
        const input = document.getElementById('chatCustomSecretInput');
        if (input && input.value.trim()) {
            activeSecretText = input.value.trim();
        }
        const btn = document.getElementById('chatSendBtn');
        if (btn) {
            btn.style.transform = 'scale(0.92)';
            setTimeout(() => { btn.style.transform = ''; }, 180);
        }
        runTwoPersonChatSequence();
    }

    const FANCY_FONTS = {
        bold: (text) => text.replace(/[A-Za-z0-9]/g, ch => {
            const code = ch.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D5D4 + (code - 65));
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D5EE + (code - 97));
            if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7EC + (code - 48));
            return ch;
        }),
        bubble: (text) => text.replace(/[A-Za-z0-9]/g, ch => {
            const code = ch.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + (code - 65));
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + (code - 97));
            if (code === 48) return '⓪';
            if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + (code - 49));
            return ch;
        }),
        gothic: (text) => {
            const gothicMap = {
                'A':'𝔄','B':'𝔅','C':'ℭ','D':'𝔇','E':'𝔈','F':'𝔉','G':'𝔊','H':'ℌ','I':'ℑ','J':'𝔍','K':'𝔎',
                'L':'𝔏','M':'𝔐','N':'𝔑','O':'𝔒','P':'𝔓','Q':'𝔔','R':'ℜ','S':'𝔖','T':'𝔗','U':'𝔘',
                'V':'𝔙','W':'𝔚','X':'𝔛','Y':'𝔜','Z':'ℨ',
                'a':'𝔞','b':'𝔟','c':'𝔠','d':'𝔡','e':'𝔢','f':'𝔣','g':'𝔤','h':'𝔥','i':'𝔦','j':'𝔧',
                'k':'𝔨','l':'𝔩','m':'𝔪','n':'𝔫','o':'𝔬','p':'𝔭','q':'𝔮','r':'𝔯','s':'𝔰','t':'𝔱',
                'u':'𝔲','v':'𝔳','w':'𝔴','x':'𝔵','y':'𝔶','z':'𝔷'
            };
            return text.split('').map(c => gothicMap[c] || c).join('');
        },
        script: (text) => text.replace(/[A-Za-z]/g, ch => {
            const code = ch.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D4D0 + (code - 65));
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D4EA + (code - 97));
            return ch;
        }),
        mono: (text) => text.replace(/[A-Za-z0-9]/g, ch => {
            const code = ch.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + (code - 65));
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D68A + (code - 97));
            if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7F6 + (code - 48));
            return ch;
        }),
        inverted: (text) => {
            const invertMap = {
                'a':'ɐ','b':'q','c':'ɔ','d':'p','e':'ǝ','f':'ɟ','g':'ƃ','h':'ɥ','i':'ᴉ','j':'ɾ','k':'ʞ',
                'l':'l','m':'ɯ','n':'u','o':'o','p':'d','q':'b','r':'ɹ','s':'s','t':'ʇ','u':'n','v':'ʌ',
                'w':'ʍ','x':'x','y':'ʎ','z':'z','A':'∀','B':'q','C':'Ɔ','D':'p','E':'Ǝ','F':'Ⅎ','G':'פ',
                'H':'H','I':'I','J':'ſ','K':'ʞ','L':'˥','M':'W','N':'N','O':'O','P':'Ԁ','Q':'Ò','R':'ɹ',
                'S':'S','T':'┴','U':'∩','V':'Λ','W':'M','X':'X','Y':'⅄','Z':'Z','0':'0','1':'Ɩ','2':'ᄅ',
                '3':'Ɛ','4':'ㄣ','5':'ϛ','6':'9','7':'ㄥ','8':'8','9':'6','?':'¿','!':'¡','.':'˙',',':'\''
            };
            return text.split('').reverse().map(c => invertMap[c] || c).join('');
        }
    };

    function updateFancyFonts() {
        const inputVal = document.getElementById('fontStudioInput').value || "Mukto Keyboard";
        const b = document.getElementById('font-out-bold');
        const c = document.getElementById('font-out-bubble');
        const g = document.getElementById('font-out-gothic');
        const s = document.getElementById('font-out-script');
        const m = document.getElementById('font-out-mono');
        const inv = document.getElementById('font-out-inverted');

        if (b) b.innerText = FANCY_FONTS.bold(inputVal);
        if (c) c.innerText = FANCY_FONTS.bubble(inputVal);
        if (g) g.innerText = FANCY_FONTS.gothic(inputVal);
        if (s) s.innerText = FANCY_FONTS.script(inputVal);
        if (m) m.innerText = FANCY_FONTS.mono(inputVal);
        if (inv) inv.innerText = FANCY_FONTS.inverted(inputVal);
    }

    function copyFontResult(elemId) {
        const el = document.getElementById(elemId);
        const isBn = document.body.className.includes('lang-bn');
        const copiedMsg = isBn ? "ক্লিপবোর্ডে কপি হয়েছে!" : "Copied to clipboard!";
        if (el && navigator.clipboard) {
            navigator.clipboard.writeText(el.innerText).then(() => {
                showToast(copiedMsg);
            });
        } else if (el) {
            showToast(copiedMsg);
        }
    }

    const typingModes = [
        {
            name: "অভ্র (Phonetic)",
            desc: "<strong>অভ্র (Avro Phonetic):</strong> সহজে ইংরেজি অক্ষরে বাংলায় লিখুন (যেমন: <code style='color:var(--emerald-300);'>ami</code> &rarr; <strong>আমি</strong>, <code style='color:var(--emerald-300);'>k</code> &rarr; <strong>ক</strong>, <code style='color:var(--emerald-300);'>kh</code> &rarr; <strong>খ</strong>)। সাথে রয়েছে ব্যাকরণসম্মত সাজেশন ও অটো-কারেকশন।"
        },
        {
            name: "English (QWERTY)",
            desc: "<strong>English (Smart QWERTY):</strong> ফুল ইংরেজি কিবোর্ড লেআউট। রয়েছে অটো-ক্যাপিটালাইজেশন, দাঁড়ি/ফুলস্টপের পর স্বয়ংক্রিয় স্পেস এবং লং-প্রেসে সিম্বল ইনপুট।"
        },
        {
            name: "বাংলা (Direct Layout)",
            desc: "<strong>বাংলা (Direct Bengali Layout):</strong> স্বরবর্ণ (অ-ঔ), ব্যঞ্জনবর্ণ (ক-হ), কার, হসন্ত এবং যুক্তবর্ণের পূর্ণাঙ্গ নেটিভ বাংলা লেআউট।"
        }
    ];
    let currentModeIndex = 0;

    function switchModePreview(idx) {
        currentModeIndex = (idx + 3) % 3;
        for (let i = 0; i < 3; i++) {
            const b = document.getElementById('modeBtn' + i);
            if (b) b.classList.toggle('active', i === currentModeIndex);
        }
        const sName = document.getElementById('spacebarDisplayName');
        const sDesc = document.getElementById('modeDescriptionText');
        if (sName) sName.innerText = typingModes[currentModeIndex].name;
        if (sDesc) sDesc.innerHTML = typingModes[currentModeIndex].desc;
    }

    function cycleLanguageMode(delta) {
        switchModePreview(currentModeIndex + delta);
        const isBn = document.body.className.includes('lang-bn');
        const msg = isBn ? ("লেআউট পরিবর্তিত: " + typingModes[currentModeIndex].name) : ("Switched to " + typingModes[currentModeIndex].name);
        showToast(msg);
    }

    function triggerSpacebarTap() {
        const isBn = document.body.className.includes('lang-bn');
        showToast(isBn ? "স্পেস ইনপুট &bull; ট্যাপ এবং সোয়াইপ সমর্থিত" : "Dispatched Space &bull; Tap & Swipe Supported");
    }

    function triggerCursorScrubDemo() {
        const isBn = document.body.className.includes('lang-bn');
        showToast(isBn ? "ট্র্যাকপ্যাড মোড সক্রিয়! আঙুল ডানে-বামে সরিয়ে কার্সার সরান।" : "Trackpad Mode Active! Drag cursor smoothly left/right.");
    }

    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playMechanicalSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const bufferSize = ctx.sampleRate * 0.025;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(1600, ctx.currentTime);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.35, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.028);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start();
        } catch (e) {
            console.error(e);
        }
    }

    function playSoftSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(190, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.045);
        } catch (e) {
            console.error(e);
        }
    }

    function playPopSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(380, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {
            console.error(e);
        }
    }

    const transliterateDemos = [
        {
            steps: [
                { in: "a", out: "আ" },
                { in: "am", out: "আম" },
                { in: "ami", out: "আমি" },
                { in: "ami ", out: "আমি " },
                { in: "ami b", out: "আমি ব" },
                { in: "ami ba", out: "বা" },
                { in: "ami ban", out: "বাং" },
                { in: "ami bang", out: "বাং" },
                { in: "ami bangl", out: "বাংল" },
                { in: "ami bangla", out: "আমি বাংলা" },
                { in: "ami banglay", out: "আমি বাংলায়" },
                { in: "ami banglay ", out: "আমি বাংলায় " },
                { in: "ami banglay g", out: "আমি বাংলায় গ" },
                { in: "ami banglay ga", out: "আমি বাংলায় গা" },
                { in: "ami banglay gan", out: "আমি বাংলায় গান" },
                { in: "ami banglay gan ", out: "আমি বাংলায় গান " },
                { in: "ami banglay gan g", out: "আমি বাংলায় গান গ" },
                { in: "ami banglay gan ga", out: "আমি বাংলায় গান গা" },
                { in: "ami banglay gan gai", out: "আমি বাংলায় গান গাই" }
            ]
        },
        {
            steps: [
                { in: "t", out: "ত" },
                { in: "to", out: "তো" },
                { in: "tom", out: "তোম" },
                { in: "toma", out: "তোমা" },
                { in: "tomar", out: "তোমার" },
                { in: "tomar ", out: "তোমার " },
                { in: "tomar n", out: "তোমার ন" },
                { in: "tomar na", out: "তোমার না" },
                { in: "tomar nam", out: "তোমার নাম" },
                { in: "tomar nam ", out: "তোমার নাম " },
                { in: "tomar nam k", out: "তোমার নাম ক" },
                { in: "tomar nam ki", out: "তোমার নাম কি" },
                { in: "tomar nam ki?", out: "তোমার নাম কি?" }
            ]
        },
        {
            steps: [
                { in: "m", out: "ম" },
                { in: "mu", out: "মু" },
                { in: "muk", out: "মুক" },
                { in: "mukt", out: "মুক্ত" },
                { in: "mukto", out: "মুক্ত" },
                { in: "mukto ", out: "মুক্ত " },
                { in: "mukto k", out: "মুক্ত ক" },
                { in: "mukto ke", out: "মুক্ত কে" },
                { in: "mukto key", out: "মুক্ত কি" },
                { in: "mukto keyb", out: "মুক্ত কিব" },
                { in: "mukto keybo", out: "মুক্ত কিবো" },
                { in: "mukto keyboa", out: "মুক্ত কিবোয়া" },
                { in: "mukto keyboar", out: "মুক্ত কিবোর" },
                { in: "mukto keyboard", out: "মুক্ত কিবোর্ড" },
                { in: "mukto keyboard ", out: "মুক্ত কিবোর্ড " },
                { in: "mukto keyboard s", out: "মুক্ত কিবোর্ড স" },
                { in: "mukto keyboard sh", out: "মুক্ত কিবোর্ড শ" },
                { in: "mukto keyboard sha", out: "মুক্ত কিবোর্ড শা" },
                { in: "mukto keyboard shadh", out: "মুক্ত কিবোর্ড সাধ" },
                { in: "mukto keyboard shadhi", out: "মুক্ত কিবোর্ড স্বাধীন" },
                { in: "mukto keyboard shadhin", out: "মুক্ত কিবোর্ড স্বাধীন" }
            ]
        },
        {
            steps: [
                { in: "b", out: "ব" },
                { in: "ba", out: "বা" },
                { in: "ban", out: "বাং" },
                { in: "bang", out: "বাং" },
                { in: "bangl", out: "বাংল" },
                { in: "bangla", out: "বাংলা" },
                { in: "bangla ", out: "বাংলা " },
                { in: "bangla a", out: "বাংলা আ" },
                { in: "bangla am", out: "বাংলা আম" },
                { in: "bangla ama", out: "বাংলা আমা" },
                { in: "bangla amad", out: "বাংলা আমাদ" },
                { in: "bangla amade", out: "বাংলা আমাদে" },
                { in: "bangla amader", out: "বাংলা আমাদের" },
                { in: "bangla amader ", out: "বাংলা আমাদের " },
                { in: "bangla amader b", out: "বাংলা আমাদের ব" },
                { in: "bangla amader bh", out: "বাংলা আমাদের ভ" },
                { in: "bangla amader bha", out: "বাংলা আমাদের ভা" },
                { in: "bangla amader bhas", out: "বাংলা আমাদের ভাষ" },
                { in: "bangla amader bhash", out: "বাংলা আমাদের ভাষ" },
                { in: "bangla amader bhasha", out: "বাংলা আমাদের ভাষা" }
            ]
        }
    ];

    let currentDemoIdx = 0;
    let currentStepIdx = 0;
    let isErasing = false;

    function runTypewriterTick() {
        const inEl = document.getElementById('tickerInputText');
        const outEl = document.getElementById('tickerOutputText');
        if (!inEl || !outEl) return;

        const demo = transliterateDemos[currentDemoIdx];
        const steps = demo.steps;

        if (!isErasing) {
            if (currentStepIdx < steps.length) {
                const currentStep = steps[currentStepIdx];
                inEl.textContent = currentStep.in;
                outEl.textContent = currentStep.out;
                currentStepIdx++;
                setTimeout(runTypewriterTick, 90);
            } else {
                setTimeout(() => {
                    isErasing = true;
                    runTypewriterTick();
                }, 2400);
            }
        } else {
            if (currentStepIdx > 0) {
                currentStepIdx--;
                if (currentStepIdx > 0) {
                    const currentStep = steps[currentStepIdx - 1];
                    inEl.textContent = currentStep.in;
                    outEl.textContent = currentStep.out;
                } else {
                    inEl.textContent = "";
                    outEl.textContent = "";
                }
                setTimeout(runTypewriterTick, 38);
            } else {
                isErasing = false;
                currentStepIdx = 0;
                currentDemoIdx = (currentDemoIdx + 1) % transliterateDemos.length;
                setTimeout(runTypewriterTick, 400);
            }
        }
    }

    
    let ocrScanning = false;
    function triggerOcrScanDemo(sampleType) {
        if (ocrScanning) return;
        ocrScanning = true;
        const laser = document.getElementById('ocrScanLaser');
        const statusText = document.getElementById('ocrScanStatus');
        const resultBox = document.getElementById('ocrResultText');
        
        let targetText = '';
        if (sampleType === 'book') {
            targetText = 'আমাদের ছোট নদী চলে বাঁকে বাঁকে,\nবৈশাখ মাসে তার হাঁটু জল থাকে।';
        } else if (sampleType === 'receipt') {
            targetText = 'মেমো নং: ৮৪২৯ • প্রদেয়: ১,৪৫০ টাকা\nতারিখ: ১২ অক্টোবর ২০২৬';
        } else {
            targetText = 'বাংলা ভাষা ও ডিজিটাল বাংলাদেশ — মুক্ত কিবোর্ড অন-ডিভাইস ওসিআর স্ক্যানার।';
        }

        if (laser) {
            laser.style.display = 'block';
            laser.classList.add('scanning');
        }
        if (statusText) statusText.innerText = 'অন-ডিভাইস এমএল কিট টেক্সট পড়ছে...';
        if (resultBox) resultBox.innerText = 'স্ক্যানিং চলছে...';

        setTimeout(function() {
            if (laser) {
                laser.style.display = 'none';
                laser.classList.remove('scanning');
            }
            if (statusText) statusText.innerText = 'স্ক্যানিং সফল! (১০০% অন-ডিভাইস RAM প্রসেসিং)';
            if (resultBox) resultBox.innerText = targetText;
            ocrScanning = false;
        }, 1100);
    }

    let aiProcessing = false;
    function triggerAiAssistantDemo(actionType) {
        if (aiProcessing) return;
        aiProcessing = true;
        const outputEl = document.getElementById('aiDemoOutput');
        const statusEl = document.getElementById('aiDemoStatus');

        let outputText = '';
        if (actionType === 'grammar') {
            outputText = 'আমি গতকাল মিটিংয়ে উপস্থিত থাকতে পারিনি, তবে আজকের সমস্ত কাজের আপডেট প্রস্তুত রয়েছে।';
        } else if (actionType === 'email') {
            outputText = 'শ্রদ্ধেয় মহোদয়,\nবিনীত নিবেদন এই যে, আজকের নির্ধারিত মিটিংয়ে আমার কিছুটা বিলম্ব হতে পারে। আমি সময়মতো সমস্ত কাজের ফাইল পাঠিয়ে দিচ্ছি।\nবিনীত,\nসৌরভ';
        } else if (actionType === 'sadhu') {
            outputText = 'তিনি প্রস্থান করেছিলেন এবং যাওয়ার সময় সকলের কুশল কামনা করেছিলেন।';
        } else if (actionType === 'banglish') {
            outputText = 'আমি তোমাকে অনেক ভালোবাসি কিন্তু কাজের চাপে সময় দিতে পারছি না, মন খারাপ করো না।';
        }

        if (statusEl) statusEl.innerText = 'এআই ট্রান্সফরমেশন চলছে (BYOK ডিরেক্ট কল)...';
        if (outputEl) {
            outputEl.innerText = '';
            let charIdx = 0;
            let streamer = setInterval(function() {
                if (charIdx < outputText.length) {
                    outputEl.innerText += outputText.charAt(charIdx);
                    charIdx++;
                } else {
                    clearInterval(streamer);
                    if (statusEl) statusEl.innerText = 'সম্পন্ন! (জিরো ক্লাউড লগিং • লোকাল কি সিকিউরিটি)';
                    aiProcessing = false;
                }
            }, 22);
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        const urlParams = new URLSearchParams(window.location.search);
        let lang = urlParams.get('language') || 'bn';
        if (!['en', 'bn', 'bl'].includes(lang)) { lang = 'bn'; }
        setLanguage(lang);

        updateFancyFonts();
        runTypewriterTick();
        runTwoPersonChatSequence();

        window.addEventListener('scroll', function() {
            const btn = document.getElementById('backToTopBtn');
            if (window.scrollY > 350) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });
    });

    function setLanguage(lang) {
        document.body.className = 'lang-' + lang;
        const btnEn = document.getElementById('btnEn');
        const btnBn = document.getElementById('btnBn');
        const btnBl = document.getElementById('btnBl');
        if (btnEn) btnEn.classList.toggle('active', lang === 'en');
        if (btnBn) btnBn.classList.toggle('active', lang === 'bn');
        if (btnBl) btnBl.classList.toggle('active', lang === 'bl');

        const url = new URL(window.location);
        url.searchParams.set('language', lang);
        window.history.pushState({}, '', url);
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

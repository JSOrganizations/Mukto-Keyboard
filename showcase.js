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
    document.querySelectorAll('.chat-carrier-chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const bEmoji = document.getElementById('chatBubbleCarrierEmoji');
    if (bEmoji) bEmoji.innerText = emoji;
}

function selectSecretPreset(msg, btn) {
    activeSecretText = msg;
    document.querySelectorAll('.secret-preset-chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const revText = document.getElementById('chatRevealedContentText');
    if (revText) revText.innerText = msg;
    runTwoPersonChatSequence();
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
            msg2.style.animation = 'slideInSent 0.35s ease forwards';
            if (area) area.scrollTop = area.scrollHeight;
        }

        chatAnimTimeouts.push(setTimeout(() => {
            if (revLayer && currentPerspective === 'mukto') {
                revLayer.style.display = 'block';
                revLayer.style.animation = 'fadeInRevealed 0.4s ease forwards';
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
                        msg3.style.animation = 'slideInReceived 0.35s ease forwards';
                        if (area) area.scrollTop = area.scrollHeight;
                    }
                }, 1700));
            }, 1100));
        }, 700));
    }, 400));
}

function replayChatConversation() {
    runTwoPersonChatSequence();
}

const keyboardLayoutsData = {
    avro: {
        name: "অভ্র ফোনেটিক (Avro Phonetic)",
        preview: "আমি বাংলায় গান গাই — ami banglay gan gai",
        suggestions: ["আমি", "বাংলায়", "গান", "গাই", "আমাদের", "বাংলাদেশ"],
        rows: [
            ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
            ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
            ["⇧", "z", "x", "c", "v", "b", "n", "m", "⌫"],
            ["?123", "🌐", "স্পেসবার (সোয়াইপ)", "Enter"]
        ]
    },
    direct: {
        name: "সরাসরি বাংলা ৫-সারি (Direct Bengali)",
        preview: "ক + া = কা, ক + ি = কি (স্বয়ংক্রিয় কার পরিবর্তন)",
        suggestions: ["কাক", "কাজ", "কাল", "কাছে", "কাগজ", "কাটা"],
        rows: [
            ["কা", "কি", "কী", "কু", "কূ", "কৃ", "কে", "কৈ", "কো", "কৌ"],
            ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ"],
            ["ট", "ঠ", "ড", "ঢ", "ণ", "ত", "থ", "দ", "ধ", "ন"],
            ["প", "ফ", "ব", "ভ", "ম", "য", "র", "ল", "শ", "ষ"],
            ["স", "হ", "ড়", "ঢ়", "য়", "ৎ", "ং", "ঃ", "ঁ", "্"]
        ]
    },
    probhat: {
        name: "প্রভাত লেআউট (Probhat Layout)",
        preview: "দ ূ ী র ট এ ু ি ও প ে ো — চিরাচরিত প্রভাত",
        suggestions: ["প্রভাত", "দিন", "রাত্রি", "সুন্দর", "দেশ"],
        rows: [
            ["দ", "ূ", "ী", "র", "ট", "এ", "ু", "ি", "ও", "প", "ে", "ো"],
            ["া", "স", "ড", "ত", "গ", "হ", "জ", "ক", "ল"],
            ["⇧", "য়", "শ", "চ", "আ", "ব", "ন", "ম", "্", "ৎ", "⌫"],
            ["?123", "🌐", "স্পেসবার", "Enter"]
        ]
    },
    jatiya: {
        name: "জাতীয় লেআউট (National / Jatiya Layout)",
        preview: "ঙ য ড প ট চ জ হ গ ড় — বিসিসি জাতীয় লেআউট",
        suggestions: ["জাতীয়", "বাংলাদেশ", "ভাষা", "মুক্তি", "শহীদ"],
        rows: [
            ["ঙ", "য", "ড", "প", "ট", "চ", "জ", "হ", "গ", "ড়"],
            ["ৃ", "ু", "ি", "ব", "্", "া", "ক", "ত", "দ"],
            ["⇧", "ঁ", "ো", "ে", "র", "ন", "স", "ম", "⌫"],
            ["?123", "🌐", "স্পেসবার", "Enter"]
        ]
    },
    english: {
        name: "স্মার্ট ইংলিশ (English Smart QWERTY)",
        preview: "Smart capitalization & context-aware auto-spacing",
        suggestions: ["The", "Mukto", "Keyboard", "Fast", "Private", "Secure"],
        rows: [
            ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
            ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
            ["⇧", "z", "x", "c", "v", "b", "n", "m", "⌫"],
            ["?123", "🌐", "Spacebar", "Enter"]
        ]
    },
    numpad: {
        name: "ক্যালকুলেটর নামপ্যাড (Calculator Numpad)",
        preview: "১২৩ ↔ 123 ও অপারেটর গ্রিড (+ - * /)",
        suggestions: ["১২৩৪", "৫৬৭৮", "৯৮০ ৳", "+৮৮০", "২০২৬"],
        rows: [
            ["৭", "৮", "৯", "+"],
            ["৪", "৫", "৬", "-"],
            ["১", "২", "৩", "*"],
            ["১২৩⇄123", "০", ".", "/", "Enter"]
        ]
    },
    symbols: {
        name: "২-পৃষ্ঠার সিম্বল, টাকা (৳) ও স্পেশাল টপ রো",
        preview: "টাকা ৳ ও স্পেশাল চিহ্ন: ☞ ◑ ♥ ✘ ✔ ✪ ∞ ⇨ ➤ ✆",
        suggestions: ["৳", "♥", "✔", "★", "→", "•"],
        rows: [
            ["☞", "◑", "♥", "✘", "✔", "✪", "∞", "⇨", "➤", "✆"],
            ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
            ["@", "#", "৳", "$", "%", "&", "-", "+", "(", ")"],
            ["=\\<", "*", "\"", "'", ":", ";", "!", "?", "⌫"],
            ["ABC", "🌐", "স্পেসবার", "Enter"]
        ]
    }
};

let currentActiveLayoutKey = "avro";

function renderKeyboardDeck(layoutKey) {
    const data = keyboardLayoutsData[layoutKey];
    if (!data) return;

    const previewEl = document.getElementById('kbPreviewText');
    if (previewEl) previewEl.textContent = data.preview;

    const suggContainer = document.getElementById('kbSuggestionStrip');
    if (suggContainer) {
        suggContainer.innerHTML = '';
        data.suggestions.forEach((sug, i) => {
            const chip = document.createElement('span');
            chip.className = 'kb-sugg-chip' + (i === 0 ? ' active' : '');
            chip.textContent = sug;
            chip.onclick = () => {
                if (previewEl) previewEl.textContent = sug;
                playSoftTap();
            };
            suggContainer.appendChild(chip);
        });
    }

    const deckEl = document.getElementById('kbKeysDeck');
    if (!deckEl) return;
    deckEl.innerHTML = '';

    data.rows.forEach(rowKeys => {
        const rowEl = document.createElement('div');
        rowEl.className = 'kb-row';
        rowKeys.forEach(k => {
            const keyEl = document.createElement('button');
            keyEl.type = 'button';
            keyEl.className = 'kb-key';

            if (k.includes('স্পেস') || k.toLowerCase().includes('space')) {
                keyEl.classList.add('space');
            } else if (k === 'Enter') {
                keyEl.classList.add('enter');
            } else if (['⇧', '⌫', '?123', 'ABC', '🌐', '=\\<', '১২৩⇄123'].includes(k)) {
                keyEl.classList.add('action');
            }

            keyEl.textContent = k;
            keyEl.onclick = () => {
                playMechanicalClick();
                if (previewEl && !['⇧', '⌫', '?123', 'ABC', '🌐', '=\\<'].includes(k)) {
                    if (k.includes('স্পেস') || k.toLowerCase().includes('space')) {
                        previewEl.textContent += " ";
                    } else if (k === 'Enter') {
                        previewEl.textContent += " ↵";
                    } else if (k === '১২৩⇄123') {
                        toggleNumpadBangla();
                    } else {
                        previewEl.textContent += k;
                    }
                }
            };
            rowEl.appendChild(keyEl);
        });
        deckEl.appendChild(rowEl);
    });

    const directBar = document.getElementById('directKarDemoBar');
    if (directBar) {
        directBar.style.display = (layoutKey === 'direct') ? 'flex' : 'none';
    }
}

function switchKeyboardLayout(layoutKey, btn) {
    currentActiveLayoutKey = layoutKey;
    document.querySelectorAll('.kb-layout-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderKeyboardDeck(layoutKey);
}

let isNumpadBangla = true;
function toggleNumpadBangla() {
    isNumpadBangla = !isNumpadBangla;
    if (isNumpadBangla) {
        keyboardLayoutsData.numpad.rows = [
            ["৭", "৮", "৯", "+"],
            ["৪", "৫", "৬", "-"],
            ["১", "২", "৩", "*"],
            ["১২৩⇄123", "০", ".", "/", "Enter"]
        ];
    } else {
        keyboardLayoutsData.numpad.rows = [
            ["7", "8", "9", "+"],
            ["4", "5", "6", "-"],
            ["1", "2", "3", "*"],
            ["১২৩⇄123", "0", ".", "/", "Enter"]
        ];
    }
    renderKeyboardDeck('numpad');
}

function selectDirectConsonant(c, btn) {
    document.querySelectorAll('.consonant-chip').forEach(el => el.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const vowelsKars = ["া", "ি", "ী", "ু", "ূ", "ৃ", "ে", "ৈ", "ো", "ৌ"];
    keyboardLayoutsData.direct.rows[0] = vowelsKars.map(k => c + k);
    keyboardLayoutsData.direct.preview = c + " + কার রূপান্তর: " + vowelsKars.map(k => c + k).join(" ");
    renderKeyboardDeck('direct');
}

const ocrSamples = {
    book: {
        display: "বইয়ের পাতা (Book Page)",
        raw: "বাংলা আমাদের মাতৃভাষা। বায়ান্নর ভাষা আন্দোলনের রক্তক্ষয়ী ইতিহাস আমাদের গর্ব ও অহংকার।",
        extracted: "বাংলা আমাদের মাতৃভাষা। বায়ান্নর ভাষা আন্দোলনের রক্তক্ষয়ী ইতিহাস আমাদের গর্ব ও অহংকার।"
    },
    receipt: {
        display: "দোকানের রশিদ (Receipt)",
        raw: "সুপারশপ ভাউচার — চাল ৫ কেজি, ডাল ২ কেজি, খাঁটি সরিষার তেল ১ লিটার। মোট পরিশোধ: ৯৮০ ৳",
        extracted: "সুপারশপ ভাউচার — চাল ৫ কেজি, ডাল ২ কেজি, খাঁটি সরিষার তেল ১ লিটার। মোট পরিশোধ: ৯৮০ ৳"
    },
    sign: {
        display: "রাস্তার সাইনবোর্ড (Signboard)",
        raw: "সাবধান! সামনে বিদ্যালয়, হর্ন বাজাবেন না। সর্বোচ্চ গতিসীমা ২০ কিমি/ঘণ্টা।",
        extracted: "সাবধান! সামনে বিদ্যালয়, হর্ন বাজাবেন না। সর্বোচ্চ গতিসীমা ২০ কিমি/ঘণ্টা।"
    }
};

function selectOcrSample(key, btn) {
    document.querySelectorAll('.ocr-sample-chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const sample = ocrSamples[key];
    if (!sample) return;

    const rawEl = document.getElementById('ocrStageText');
    const extEl = document.getElementById('ocrExtractedText');
    if (rawEl) rawEl.textContent = sample.raw;
    if (extEl) {
        extEl.textContent = "স্ক্যানিং চলছে...";
        setTimeout(() => {
            extEl.textContent = sample.extracted;
            showToast("OCR টেক্সট সফলভাবে এক্সট্র্যাক্ট হয়েছে!");
        }, 600);
    }
}

function selectTransPreset(inText, outText, btn) {
    document.querySelectorAll('.trans-chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const outBox = document.getElementById('transLiveResult');
    if (outBox) {
        outBox.innerHTML = `<strong>${outText}</strong>`;
        showToast("অনুবাদ সম্পন্ন হয়েছে!");
    }
}

const aiActionsData = {
    grammar: {
        draft: "আমি কালকে ঢাকায় গেছিলাম এবং অনেক সুন্দর লাগছে।",
        output: "আমি গতকাল ঢাকায় গিয়েছিলাম এবং আমার খুব ভালো লেগেছে।"
    },
    email: {
        draft: "ছুটি দরকার ৩ দিনের শরীর ভালো না কাজে যাইতে পারব না।",
        output: "শ্রদ্ধেয় মহোদয়, শারীরিক অসুস্থতার কারণে আগামী ৩ দিনের নৈমিত্তিক ছুটি মঞ্জুর করার বিনীত অনুরোধ জানাচ্ছি।"
    },
    sadhu_cholito: {
        draft: "তাহারা নদীর তীরে বসিয়া আনন্দ চিত্তে গল্প করিতেছিলেন।",
        output: "তারা নদীর পাড়ে বসে আনন্দ মনে গল্প করছিলেন।"
    },
    bangla_banglish: {
        draft: "কেমন আছো? কালকে বিকেলে তোমার সাথে দেখা হবে।",
        output: "Kemon acho? Kalke bikele tomar sathe dekha hobe."
    },
    rephrase: {
        draft: "কিবোর্ডটা অনেক ফাস্ট আর কোনো ল্যাগ নাই একদমই।",
        output: "কিবোর্ডটি অত্যন্ত মসৃণ, দ্রুতগতির এবং পুরোপুরি ল্যাগ-মুক্ত এক অনন্য টাইপিং অভিজ্ঞতা প্রদান করে।"
    },
    shorten: {
        draft: "আমরা সবাই মিলে আগামী শুক্রবার বিকেলে ধানমন্ডি লেকের পাড়ে বসে অনেক সময় ধরে আড্ডা দেওয়ার পরিকল্পনা করেছি।",
        output: "শুক্রবার বিকেলে ধানমন্ডি লেকে আমাদের বন্ধুদের আড্ডার পরিকল্পনা হয়েছে।"
    }
};

function selectAiAction(actionKey, btn) {
    document.querySelectorAll('.ai-action-chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const data = aiActionsData[actionKey];
    if (!data) return;

    const draftEl = document.getElementById('aiDraftBox');
    const outEl = document.getElementById('aiOutputBox');
    if (draftEl) draftEl.textContent = data.draft;
    if (outEl) {
        outEl.textContent = "AI প্রসেসিং চলছে...";
        setTimeout(() => {
            outEl.textContent = data.output;
            showToast("এআই অ্যাকশন রূপান্তর সফল!");
        }, 500);
    }
}

const fancyFontMaps = {
    bold: {
        name: "Bold",
        fn: text => text.replace(/[A-Za-z0-9]/g, c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + code - 97);
            if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7CE + code - 48);
            return c;
        })
    },
    bubble: {
        name: "Bubble",
        fn: text => text.replace(/[A-Za-z0-9]/g, c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + code - 97);
            if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + code - 49);
            if (code === 48) return '⓪';
            return c;
        })
    },
    gothic: {
        name: "Gothic",
        fn: text => text.replace(/[A-Za-z]/g, c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D56C + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D586 + code - 97);
            return c;
        })
    },
    script: {
        name: "Script",
        fn: text => text.replace(/[A-Za-z]/g, c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D4D0 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D4EA + code - 97);
            return c;
        })
    },
    monospace: {
        name: "Monospace",
        fn: text => text.replace(/[A-Za-z0-9]/g, c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D68A + code - 97);
            if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7F6 + code - 48);
            return c;
        })
    },
    outline: {
        name: "Outline",
        fn: text => text.replace(/[A-Za-z]/g, c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D538 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D552 + code - 97);
            return c;
        })
    },
    squared: {
        name: "Squared",
        fn: text => text.replace(/[A-Za-z]/g, c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F130 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1F130 + code - 97);
            return c;
        })
    },
    upsidedown: {
        name: "Upside Down",
        fn: text => {
            const map = {
                'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ',
                'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u',
                'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n',
                'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
                'A': '∀', 'B': '𐐒', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁',
                'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N',
                'O': 'O', 'P': 'Ԁ', 'Q': 'Ό', 'R': 'ᴚ', 'S': 'S', 'T': '⊥', 'U': '∩',
                'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z'
            };
            return text.split('').reverse().map(ch => map[ch] || ch).join('');
        }
    }
};

let currentFontPhrase = "Mukto Keyboard";

function updateFancyFontCards() {
    const grid = document.getElementById('fontStudioGrid');
    if (!grid) return;
    grid.innerHTML = '';

    Object.keys(fancyFontMaps).forEach(k => {
        const item = fancyFontMaps[k];
        const converted = item.fn(currentFontPhrase);

        const card = document.createElement('div');
        card.className = 'font-sample-card';
        card.innerHTML = `
            <div class="font-sample-header">
                <span>${item.name}</span>
                <button type="button" class="chip-copy-action" onclick="copyFontText('${converted.replace(/'/g, "\\'")}')">
                    <svg class="icon-svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    কপি
                </button>
            </div>
            <div class="font-sample-preview">${converted}</div>
        `;
        grid.appendChild(card);
    });
}

function selectFontPhrase(phrase, btn) {
    currentFontPhrase = phrase;
    document.querySelectorAll('.font-phrase-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    updateFancyFontCards();
}

function copyFontText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast("ফন্ট টেক্সট কপি করা হয়েছে!");
    }).catch(() => {
        showToast("কপি সম্পন্ন হয়েছে!");
    });
}

const repeaterPresets = {
    bangla: {
        text: Array.from({length: 15}, (_, i) => `${(i + 1).toLocaleString('bn-BD')}. মুক্ত কিবোর্ড`).join('\n') + '\n... (৫,০০০ বার পর্যন্ত)'
    },
    english: {
        text: Array.from({length: 15}, (_, i) => `${i + 1}. Love You`).join('\n') + '\n... (up to 5,000 times)'
    },
    emoji: {
        text: Array.from({length: 30}, () => "❤️ 🔥 ✨ 😎 🎉").join(' ') + ' ...'
    }
};

function selectRepeaterPreset(key, btn) {
    document.querySelectorAll('.repeater-chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const outEl = document.getElementById('repeaterOutputBox');
    if (outEl && repeaterPresets[key]) {
        outEl.textContent = repeaterPresets[key].text;
        showToast("টেক্সট রিপিটার প্রিভিউ আপডেট হয়েছে!");
    }
}

function testShortcut(code, expansion) {
    const box = document.getElementById('shortcutTestResult');
    if (box) {
        box.innerHTML = `স্পেস চাপতেই <strong style="color:var(--emerald-800)">"${code}"</strong> রূপান্তর হলো: <br/><strong>"${expansion}"</strong>`;
        showToast("শর্টকাট এক্সপ্যান্ড হয়েছে!");
    }
}

function selectThemePreview(themeKey, btn) {
    document.querySelectorAll('.theme-chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const canvas = document.getElementById('themePreviewCanvas');
    if (!canvas) return;

    canvas.className = 'theme-preview-canvas ' + themeKey;
    const desc = document.getElementById('themePreviewDesc');

    if (themeKey === 'swing') {
        if (desc) desc.textContent = "দোলনা জীবন্ত থিম: শান্ত গোধূলি বেলার অ্যানিমেটেড প্রাকৃতিক দোলনা (Swing Living World)";
    } else if (themeKey === 'harbor') {
        if (desc) desc.textContent = "শান্ত বন্দর জীবন্ত থিম: পানির ঢেউ ও বাতিঘরের শান্ত স্নিগ্ধ পরিবেশ (Harbor Living World)";
    } else if (themeKey === 'colorwave') {
        if (desc) desc.textContent = "কালার-ওয়েভ ইফেক্ট: কী স্পর্শ করলেই রেইনবো তরঙ্গের আলোকচ্ছটা (0% Idle CPU)";
    } else if (themeKey === 'video') {
        if (desc) desc.textContent = "লাইভ ভিডিও থিম: ২৫ সেকেন্ডের লুপ ট্রিমার ও বুমেরাং রিভার্স প্লেব্যাক মোড";
    } else if (themeKey === 'handwriting') {
        if (desc) desc.textContent = "হ্যান্ডরাইটিং কিবোর্ড: নিজের হাতের অক্ষরে ইংরেজি A-Z ও সাজেশনের রূপান্তর";
    }
}

let audioCtx = null;
function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playMechanicalClick() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
}

function playSoftTap() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
}

function playBubblePop() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
}

const ergoModesInfo = {
    docked: {
        title: "ডকড ফুল মোড (Full Docked)",
        desc: "স্ক্রিনের নিচে স্থিতিশীল পূর্ণ দৈর্ঘ্যের কিবোর্ড, উচ্চতা ৭০% থেকে ১৩০% পর্যন্ত যেকোনো সাইজে সামঞ্জস্যযোগ্য।"
    },
    onehanded_left: {
        title: "ওয়ান-হ্যান্ডেড মোড (বাম হাত)",
        desc: "বাম পাশে সংকুচিত কমপ্যাক্ট কিবোর্ড, এক হাতে টাইপিংয়ের জন্য পাশের রেল থেকে মুহূর্তেই ফুল মোডে ফিরে যাওয়া যায়।"
    },
    onehanded_right: {
        title: "ওয়ান-হ্যান্ডেড মোড (ডান হাত)",
        desc: "ডান পাশে চেপে থাকা এক হাতের মোড, বাসে বা চলাফেরার সময় দ্রুত টাইপ করার আদর্শ লেআউট।"
    },
    floating: {
        title: "ফ্লোটিং কিবোর্ড (Floating Draggable)",
        desc: "স্ক্রিনের যেকোনো জায়গায় টেনে নিয়ে রাখা যায়। পোর্ট্রেট ও ল্যান্ডস্কেপ মোডের সাইজ আলাদা মনে রাখে।"
    },
    dpad: {
        title: "প্রিসিশন টেক্সট এডিটিং D-Pad প্যানেল",
        desc: "কার্সার মুভ করার আপ/ডাউন/লেফট/রাইট বাটন, সিলেক্ট, অল-সিলেক্ট, কাট, কপি, পেস্ট ও Home/End অ্যাকশন।"
    },
    trackpad: {
        title: "স্পেসবার সোয়াইপ ও ২৮০ms কার্সর ট্র্যাকপ্যাড",
        desc: "স্পেসবারে সোয়াইপ করলেই ভাষা পরিবর্তন, আর ২৮০ms চেপে ধরে রাখলেই চালু হয় ল্যাপটপ ট্র্যাকপ্যাডের মতো স্মুথ কার্সর মুভমেন্ট।"
    }
};

function selectErgoMode(modeKey, btn) {
    document.querySelectorAll('.ergo-mode-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const info = ergoModesInfo[modeKey];
    const stage = document.getElementById('ergoPreviewStage');
    if (stage && info) {
        stage.innerHTML = `
            <div>
                <h4 style="font-size:1.15rem; font-weight:800; color:#34d399; margin-bottom:8px;">${info.title}</h4>
                <p style="font-size:14px; color:#cbd5e1; max-width:540px; margin:0 auto;">${info.desc}</p>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    renderKeyboardDeck('avro');
    updateFancyFontCards();
    runTwoPersonChatSequence();
});

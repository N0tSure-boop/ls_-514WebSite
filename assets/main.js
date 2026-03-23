
// powered by sin
document.addEventListener('touchmove', function (e) {
    if (e.target.closest('.swipe-wrapper') || e.target.closest('.wish-wall')) return;
    e.preventDefault();
}, { passive: false });

// 全局星星点击效果
document.addEventListener('click', function (e) {
    if (e.target.closest('.quiz-option') || e.target.closest('button') || e.target.closest('.match-item') || e.target.closest('.find-cell') || e.target.tagName.toLowerCase() === 'input') return;

    const star = document.createElement('div');
    star.className = 'fly-star';
    star.innerHTML = '⭐';
    star.style.left = (e.clientX - 12) + 'px';
    star.style.top = (e.clientY - 12) + 'px';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1200);
});

// ========== 答题闯关（随机题库） ==========
const questionBank = [
    { q: "总体国家安全观的核心要义中，以什么安全为宗旨？", options: ["政治安全", "经济安全", "人民安全", "军事安全"], correct: 2, hint: "人民安全是国家安全的目的，一切为了人民。" },
    { q: "国家安全机关受理公民和组织举报电话是？", options: ["12345", "12339", "110", "96110"], correct: 1, hint: "12339 是国家安全举报热线，请牢记！" },
    { q: "哪一项属于“大安全”理念涵盖的领域？", options: ["仅军事", "仅网络", "政治、经济、生态等", "仅国土"], correct: 2, hint: "总体国家安全观包含全方位领域。" },
    { q: "国家安全工作应当坚持什么样的安全观？", options: ["总体国家安全观", "传统安全观", "军事安全观", "经济安全观"], correct: 0, hint: "总体国家安全观是新时代的根本遵循。" },
    { q: "维护国家安全，公民应当履行哪些义务？", options: ["保守秘密", "报告线索", "配合工作", "以上都是"], correct: 3, hint: "保守秘密、报告线索、配合工作都是法定义务。" },
    { q: "每年全民国家安全教育日是哪一天？", options: ["3月15日", "4月15日", "5月15日", "6月15日"], correct: 1, hint: "每年4月15日是全民国家安全教育日。" },
    { q: "总体国家安全观的根本是什么？", options: ["人民安全", "政治安全", "经济安全", "文化安全"], correct: 1, hint: "政治安全是总体国家安全观的根本。" },
    { q: "国家安全的基础是哪个领域的安全？", options: ["军事安全", "科技安全", "经济安全", "社会安全"], correct: 2, hint: "经济安全是国家安全的基础。" },
    { q: "发现间谍行为或线索，除了拨打12339，还可以通过什么平台举报？", options: ["国家安全机关互联网举报受理平台", "微信朋友圈", "微博留言", "贴吧发帖"], correct: 0, hint: "请通过官方正规渠道进行举报。" },
    { q: "《中华人民共和国国家安全法》是哪一年施行的？", options: ["2014年", "2015年", "2016年", "2017年"], correct: 1, hint: "该法于2015年7月1日起施行。" },
    { q: "下列哪种行为可能危害国家安全？", options: ["在军事禁区拍照", "学习国家安全知识", "参加爱国主义教育", "遵守法律法规"], correct: 0, hint: "军事禁区涉及国家机密，严禁拍照。" },
    { q: "生物安全属于国家安全体系中的哪一类？", options: ["传统安全", "非传统安全", "经济安全", "政治安全"], correct: 1, hint: "生物、网络、数据等属于非传统安全领域。" },
    { q: "在境外遇到危害国家安全的情况，应当向哪个机构求助或报告？", options: ["当地警察", "中国驻外使领馆", "国际刑警", "外国政府"], correct: 1, hint: "中国驻外使领馆是保护海外公民和国家利益的重要机构。" },
    { q: "“没有网络安全就没有国家安全”，这是强调了哪个领域的重要性？", options: ["文化安全", "科技安全", "网络安全", "社会安全"], correct: 2, hint: "网络空间已成为国家安全的新疆域。" },
    { q: "国家安全是安邦定国的重要基石，维护国家安全是？", options: ["仅是国家安全机关的责任", "仅是军人的责任", "全国各族人民根本利益所在", "仅是政府干部的责任"], correct: 2, hint: "国家安全，人人有责，人人尽责。" }
];

// 从题库中随机抽取5道题
function getRandomQuestions(bank, num) {
    const shuffled = [...bank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

const questions = getRandomQuestions(questionBank, 5);
let correctCount = 0;
let quizLocked = [false, false, false, false, false];

function updateGlobalScore() {
    document.getElementById('globalScoreBoard').innerHTML = `⭐ 通关进度: ${correctCount}/${questions.length}`;
}

const quizContainer = document.getElementById('quizPages');
for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page';
    pageDiv.innerHTML = `
            <div class="page-415"><span>4·15</span><small>闯关答题</small></div>
            <div class="page-content-wrapper">
                <div class="series-prefix">国家安全知识闯关 · 第${i + 1}/${questions.length}关</div>
                <div class="page-title">挑战答题</div>
                <div class="quiz-card">
                    <div class="quiz-question">${i + 1}. ${q.q}</div>
                <div id="quiz-options-${i}" class="quiz-options-area"></div>
                    <div id="feedback-${i}" style="margin-top:12px; font-size:13px; font-weight:bold; text-align:center; height:20px;"></div>
                    <div class="police-helper" data-qidx="${i}">
                        <div class="police-icon">👮‍♂️</div>
                        <div>警察小安 · 获取提示</div>
                    </div>
                    <div id="helpMsg-${i}" class="help-tip" style="display:none;"></div>
                    ${i < questions.length - 1 ? '<button class="next-level" data-next="' + (i + 1) + '">下一关 ➡️</button>' : '<button class="next-level" data-next="complete">🏆 完成闯关 🏆</button>'}
                </div>
            </div>
            <div class="footer-quote">答对即可解锁下一关！</div>
        `;
    quizContainer.appendChild(pageDiv);

    const optsDiv = pageDiv.querySelector(`#quiz-options-${i}`);
    q.options.forEach((opt, optIdx) => {
        const optEl = document.createElement('div');
        optEl.className = 'quiz-option';
        optEl.innerText = opt;
        optEl.dataset.correct = (optIdx === q.correct);
        optEl.addEventListener('click', function () {
            if (quizLocked[i]) return;
            const feedbackDiv = pageDiv.querySelector(`#feedback-${i}`);
            const isCorrect = this.dataset.correct === 'true';

            if (isCorrect) {
                this.classList.add('correct');
                feedbackDiv.innerHTML = '✅ 回答正确！闯关成功！';
                feedbackDiv.style.color = '#2E7D32';
                quizLocked[i] = true;
                correctCount++;
                updateGlobalScore();
                pageDiv.querySelectorAll('.quiz-option').forEach(o => o.style.pointerEvents = 'none');

                // 屏幕中央爆星星特效
                for (let s = 0; s < 6; s++) setTimeout(() => {
                    const starFly = document.createElement('div');
                    starFly.className = 'fly-star';
                    starFly.innerHTML = '⭐';
                    starFly.style.left = (window.innerWidth / 2 - 15 + (Math.random() * 60 - 30)) + 'px';
                    starFly.style.top = (window.innerHeight / 2) + 'px';
                    document.body.appendChild(starFly);
                    setTimeout(() => starFly.remove(), 1000);
                }, s * 100);
            } else {
                this.classList.add('wrong');
                setTimeout(() => this.classList.remove('wrong'), 400);
                const correctAns = q.options[q.correct];
                feedbackDiv.innerHTML = `❌ 错误，正确答案是 “${correctAns}”`;
                feedbackDiv.style.color = '#C41E3A';
            }
        });
        optsDiv.appendChild(optEl);
    });

    const helperBtn = pageDiv.querySelector(`.police-helper[data-qidx="${i}"]`);
    const helpMsgDiv = pageDiv.querySelector(`#helpMsg-${i}`);
    helperBtn.addEventListener('click', () => {
        if (helpMsgDiv.style.display === 'block') return;
        helpMsgDiv.style.display = 'block';
        helpMsgDiv.innerHTML = `👮‍♂️ 提示：${q.hint}`;
        setTimeout(() => { helpMsgDiv.style.display = 'none'; }, 3000);
    });

    const nextBtn = pageDiv.querySelector('.next-level');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!quizLocked[i]) {
                alert('请先答对本关题目！');
                return;
            }
            const target = nextBtn.dataset.next;
            if (target === 'complete') {
                alert('🎉 恭喜完成知识闯关！你是国安小卫士！');
                const pages = document.querySelectorAll('.page');
                pages[6].scrollIntoView({ behavior: 'smooth' }); // 跳到第7页(互动)
            } else {
                const pages = document.querySelectorAll('.page');
                pages[parseInt(target) + 1].scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ========== 移动端连连看 (替代拖拽) ==========
const pairs = [
    { id: 1, name: "政治安全", match: "政权制度稳定" },
    { id: 2, name: "网络安全", match: "清朗数字空间" },
    { id: 3, name: "生物安全", match: "防控新发传染病" },
    { id: 4, name: "数据安全", match: "保护数据资产" }
];

// 打乱数组
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function buildMatchGame() {
    const leftCol = document.getElementById('matchLeft');
    const rightCol = document.getElementById('matchRight');
    leftCol.innerHTML = ''; rightCol.innerHTML = '';

    let selectedLeft = null;
    let matchedCount = 0;
    const resultMsg = document.getElementById('pairResult');

    const leftItems = shuffle([...pairs]);
    const rightItems = shuffle([...pairs]);

    leftItems.forEach(p => {
        const el = document.createElement('div');
        el.className = 'match-item left-item';
        el.innerText = p.name;
        el.dataset.id = p.id;
        el.addEventListener('click', function () {
            if (this.classList.contains('matched')) return;
            document.querySelectorAll('.left-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            selectedLeft = this;
            resultMsg.innerText = '请在右侧选择对应内容';
            resultMsg.style.color = '#FFF';
        });
        leftCol.appendChild(el);
    });

    rightItems.forEach(p => {
        const el = document.createElement('div');
        el.className = 'match-item right-item';
        el.innerText = p.match;
        el.dataset.id = p.id;
        el.addEventListener('click', function () {
            if (this.classList.contains('matched')) return;
            if (!selectedLeft) {
                resultMsg.innerText = '⚠️ 请先选择左侧领域！';
                resultMsg.style.color = '#FFB347';
                return;
            }

            if (this.dataset.id === selectedLeft.dataset.id) {
                // 匹配成功
                this.classList.add('matched');
                selectedLeft.classList.add('matched');
                selectedLeft.classList.remove('selected');
                selectedLeft = null;
                matchedCount++;
                resultMsg.innerText = '✅ 匹配成功！';
                resultMsg.style.color = '#A5D6A5';

                if (matchedCount === pairs.length) {
                    setTimeout(() => {
                        resultMsg.innerText = '🎉 恭喜！全部匹配完成！';
                        resultMsg.style.color = '#FFD966';
                    }, 500);
                }
            } else {
                // 匹配失败
                resultMsg.innerText = '❌ 匹配错误，请重试！';
                resultMsg.style.color = '#C41E3A';
                this.style.borderColor = '#C41E3A';
                this.style.background = '#FFCCBC';
                setTimeout(() => {
                    this.style.borderColor = 'transparent';
                    this.style.background = 'rgba(255, 245, 235, 0.95)';
                }, 500);
            }
        });
        rightCol.appendChild(el);
    });
}
buildMatchGame();

// ========== 能量充能环（连击挑战） ==========
const chargeBtn = document.getElementById('chargeBtn');
const energyCircle = document.getElementById('energyCircle');
const energyValue = document.getElementById('energyValue');
const energyMsg = document.getElementById('energyMsg');

let energyLevel = 0;
let decayInterval = null;
let isMaxed = false;

// 将百分比(0-100)映射为 HSL 颜色，从红色(0) 过渡到 绿色(120)
function getEnergyColor(percent) {
    // H: 0(红) -> 120(绿)
    // S: 80%
    // L: 50%
    const hue = (percent / 100) * 120;
    return `hsl(${hue}, 80%, 50%)`;
}

function updateEnergyUI() {
    const currentColor = getEnergyColor(energyLevel);

    // 进度条颜色动态渐变
    energyCircle.style.background = `conic-gradient(${currentColor} ${energyLevel}%, rgba(255,255,255,0.1) ${energyLevel}%)`;

    // 中心文字颜色和光晕同步渐变
    energyValue.style.color = currentColor;
    energyValue.style.textShadow = `0 0 10px ${currentColor}`;
    energyCircle.style.boxShadow = `0 0 ${10 + (energyLevel / 100) * 30}px ${currentColor}`;

    energyValue.innerHTML = `${Math.floor(energyLevel)}<small>%</small>`;

    // 根据进度更改提示文字（满分前）
    if (!isMaxed) {
        if (energyLevel > 0 && energyLevel < 40) {
            energyMsg.innerText = "意识初步觉醒，快点按！";
        }
        else if (energyLevel >= 40 && energyLevel < 80) {
            energyMsg.innerText = "防范意识增强，保持手速！";
        }
        else if (energyLevel >= 80 && energyLevel < 100) {
            energyMsg.innerText = "即将满能，最后冲刺！";
        } else if (energyLevel === 0) {
            energyMsg.innerText = "如果不点击，能量会流失哦！";
        }
    }
}

function startDecay() {
    if (decayInterval) return;
    decayInterval = setInterval(() => {
        if (isMaxed) {
            clearInterval(decayInterval);
            return;
        }
        if (energyLevel > 0) {
            // 每 100ms 下降 0.5%，也就是每秒下降 5%
            energyLevel -= 0.8;
            if (energyLevel < 0) energyLevel = 0;
            updateEnergyUI();
        }
    }, 100);
}

function triggerMaxEffect() {
    isMaxed = true;
    clearInterval(decayInterval);
    energyLevel = 100;
    updateEnergyUI();

    energyMsg.innerText = "🎉 充能完毕！国家安全意识满分！";
    energyMsg.style.color = "#4CAF50";
    chargeBtn.classList.add('maxed');
    chargeBtn.innerText = "🛡️ 意识满分";
    energyCircle.style.boxShadow = "0 0 50px rgba(76,175,80,0.9)";
    energyCircle.style.background = `conic-gradient(#4CAF50 100%, rgba(255,255,255,0.1) 100%)`;

    // 爆星星特效
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'fly-star';
            star.innerHTML = '✨';
            star.style.left = (window.innerWidth / 2 - 20 + (Math.random() * 140 - 70)) + 'px';
            star.style.top = (window.innerHeight / 2 + (Math.random() * 140 - 70)) + 'px';
            document.body.appendChild(star);
            setTimeout(() => star.remove(), 1000);
        }, i * 80);
    }
}

chargeBtn.addEventListener('click', (e) => {
    // 阻止连续点击时的放大缩小穿透
    e.preventDefault();

    if (isMaxed) return;

    // 每次点击只增加 4%
    energyLevel += 4;

    if (energyLevel >= 100) {
        triggerMaxEffect();
    } else {
        // 按钮点击反馈特效
        chargeBtn.style.transform = 'scale(0.9)';
        setTimeout(() => chargeBtn.style.transform = 'none', 80);

        updateEnergyUI();
        startDecay(); // 开始自动掉血机制
    }
});

// ========== 记忆翻牌游戏 ==========
const memoryKnowledge = [
    { id: 1, icon: "🛡️", title: "政治安全", desc: "政治安全是国家安全的根本。核心是政权安全和制度安全，必须毫不动摇地坚持中国共产党的领导。" },
    { id: 2, icon: "💰", title: "经济安全", desc: "经济安全是国家安全的基础。我们要确保国家经济持续健康发展，防范化解重大经济金融风险。" },
    { id: 3, icon: "🌐", title: "网络安全", desc: "没有网络安全就没有国家安全。我们要共筑网络安全防线，防范网络攻击，保护个人信息和重要数据。" },
    { id: 4, icon: "🦠", title: "生物安全", desc: "生物安全关乎人民生命健康。包括防范重大新发突发传染病、保护生物资源等重要内容。" },
    { id: 5, icon: "🌳", title: "生态安全", desc: "绿水青山就是金山银山。维护生态安全就是维护人类生存发展的基本条件。" },
    { id: 6, icon: "🚀", title: "科技安全", desc: "科技安全是支撑和保障。我们要实现高水平科技自立自强，把关键核心技术掌握在自己手中。" }
];

let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let isBoardLocked = false;

const modal = document.getElementById('knowledgeModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalCloseBtn = document.getElementById('modalCloseBtn');

modalCloseBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    if (matchedPairs === memoryKnowledge.length) {
        setTimeout(() => alert('🎉 恭喜你解锁了全部国家安全知识！'), 300);
    }
});

function buildMemoryGame() {
    const grid = document.getElementById('memoryGameGrid');
    grid.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    isBoardLocked = false;
    document.getElementById('memoryCounter').innerText = `已解锁 0 / ${memoryKnowledge.length} 个知识点`;

    // 生成成对的卡片数据
    memoryCards = [...memoryKnowledge, ...memoryKnowledge];
    // 洗牌
    memoryCards.sort(() => 0.5 - Math.random());

    memoryCards.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.id = item.id;
        card.dataset.index = index;

        card.innerHTML = `
                    <div class="memory-face memory-front">❓</div>
                    <div class="memory-face memory-back">
                        <div class="memory-icon">${item.icon}</div>
                        <div class="memory-text">${item.title}</div>
                    </div>
                `;

        card.addEventListener('click', () => flipCard(card, item));
        grid.appendChild(card);
    });
}

function flipCard(card, item) {
    if (isBoardLocked || card === flippedCards[0] || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    let isMatch = flippedCards[0].dataset.id === flippedCards[1].dataset.id;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    // 匹配成功时，保持翻开状态（不移除 flipped 类）
    flippedCards[0].classList.add('matched');
    flippedCards[1].classList.add('matched');

    // 为了安全，强制加上 flipped
    flippedCards[0].classList.add('flipped');
    flippedCards[1].classList.add('flipped');

    const matchedId = parseInt(flippedCards[0].dataset.id);
    const knowledge = memoryKnowledge.find(k => k.id === matchedId);

    matchedPairs++;
    document.getElementById('memoryCounter').innerText = `已解锁 ${matchedPairs} / ${memoryKnowledge.length} 个知识点`;

    // 延迟显示弹窗，让匹配成功动画播完
    setTimeout(() => {
        modalTitle.innerText = `${knowledge.icon} ${knowledge.title}`;
        modalDesc.innerText = knowledge.desc;
        modal.classList.add('active');
    }, 600);

    flippedCards = [];
}

function unflipCards() {
    isBoardLocked = true;
    setTimeout(() => {
        flippedCards[0].classList.remove('flipped');
        flippedCards[1].classList.remove('flipped');
        flippedCards = [];
        isBoardLocked = false;
    }, 800);
}

buildMemoryGame();

// ========== 心愿墙 ==========
let wishes = ["愿祖国繁荣昌盛，国泰民安！", "国家安全，人人有责。", "向默默奉献的国安英雄致敬！"];
const wishWall = document.getElementById('wishWall');
const wishInput = document.getElementById('wishInput');
const flyBtn = document.getElementById('flyWishBtn');

function renderWishes() {
    wishWall.innerHTML = '';
    wishes.forEach(w => {
        const div = document.createElement('div');
        div.className = 'wish-item';
        div.innerText = w;
        wishWall.appendChild(div);
    });
    wishWall.scrollTop = 0;
}
renderWishes();

function addWishAndFly() {
    const text = wishInput.value.trim();
    if (!text) return;
    wishes.unshift(text);
    if (wishes.length > 15) wishes.pop();
    renderWishes();
    wishInput.value = '';
    wishInput.blur(); // 隐藏移动端键盘

    const starFly = document.createElement('div');
    starFly.className = 'fly-star';
    starFly.innerHTML = '✨⭐✨';
    starFly.style.left = (window.innerWidth / 2 - 20) + 'px';
    starFly.style.bottom = '20px';
    document.body.appendChild(starFly);
    setTimeout(() => starFly.remove(), 1200);
}
flyBtn.addEventListener('click', addWishAndFly);
wishInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addWishAndFly(); });

// ========== 致敬英雄 ==========
const saluteBtn = document.getElementById('saluteBtn');
const saluteMsgDiv = document.getElementById('saluteMsg');
saluteBtn.addEventListener('click', () => {
    saluteMsgDiv.innerHTML = '🌹 崇高敬意已送达！';
    for (let i = 0; i < 6; i++) setTimeout(() => {
        const starFly = document.createElement('div');
        starFly.className = 'fly-star';
        starFly.innerHTML = '🌸';
        starFly.style.left = (Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1) + 'px';
        starFly.style.top = (window.innerHeight * 0.7) + 'px';
        document.body.appendChild(starFly);
        setTimeout(() => starFly.remove(), 1200);
    }, i * 150);
});

// ========== 导航圆点与滚动监听 ==========
const container = document.getElementById('scrollContainer');
const allPages = document.querySelectorAll('.page');
const dotsDiv = document.getElementById('navDots');

allPages.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.dataset.index = i;
    dot.addEventListener('click', () => allPages[i].scrollIntoView({ behavior: 'smooth' }));
    dotsDiv.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');
function updateActiveDot() {
    // 使用动态高度计算当前页
    const pageHeight = window.innerHeight;
    const scrollTop = container.scrollTop;
    let activeIdx = Math.round(scrollTop / pageHeight);

    // 防止索引越界
    if (activeIdx < 0) activeIdx = 0;
    if (activeIdx >= dots.length) activeIdx = dots.length - 1;

    dots.forEach((d, idx) => {
        if (idx === activeIdx) d.classList.add('active');
        else d.classList.remove('active');
    });
}

container.addEventListener('scroll', () => requestAnimationFrame(updateActiveDot));
// 监听窗口大小变化（如横竖屏切换）重置高度
window.addEventListener('resize', updateActiveDot);
setTimeout(updateActiveDot, 100);
updateGlobalScore();

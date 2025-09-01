// ===== VARIÁVEIS GLOBAIS =====
let currentSection = 'chat';
let isRecording = false;
let currentTheme = 'dark';
let chatHistory = [];
let searchResults = [];
let isGenerating = false;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadTheme();
    setupKeyboardShortcuts();
});

// ===== INICIALIZAÇÃO DA APLICAÇÃO =====
function initializeApp() {
    // Configurar seção ativa inicial
    showSection('chat');
    
    // Configurar auto-resize do textarea
    setupTextareaAutoResize();
    
    // Configurar tooltips
    setupTooltips();
    
    // Carregar dados salvos
    loadChatHistory();
    
    console.log('All in One AI Interface inicializada com sucesso!');
}

// ===== CONFIGURAÇÃO DE EVENT LISTENERS =====
function setupEventListeners() {
    // Navegação da sidebar
    setupSidebarNavigation();
    
    // Toggle da sidebar (mobile)
    setupSidebarToggle();
    
    // Alternância de tema
    setupThemeToggle();
    
    // Chat
    setupChatFunctionality();
    
    // Busca
    setupSearchFunctionality();
    
    // Geração de imagem
    setupImageGeneration();
    
    // Geração de áudio
    setupAudioGeneration();
    
    // Geração de vídeo
    setupVideoGeneration();
    
    // Upload de arquivos
    setupFileUpload();
    
    // Botões de opção
    setupOptionButtons();
    
    // Sliders
    setupSliders();
    
    // Toggles
    setupToggles();
}

// ===== NAVEGAÇÃO DA SIDEBAR =====
function setupSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            if (section) {
                showSection(section);
                setActiveNavItem(this);
            }
        });
    });
}

function showSection(sectionName) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar seção ativa
    const activeSection = document.getElementById(`${sectionName}-section`);
    if (activeSection) {
        activeSection.classList.add('active');
        currentSection = sectionName;
        
        // Atualizar título da seção
        updateSectionTitle(sectionName);
        
        // Executar ações específicas da seção
        onSectionChange(sectionName);
    }
}

function setActiveNavItem(activeItem) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
}

function updateSectionTitle(sectionName) {
    const titles = {
        'chat': 'All in One',
        'search': 'Buscar em Chats',
        'image': 'Geração de Imagem',
        'audio': 'Geração de Áudio',
        'video': 'Geração de Vídeo'
    };
    
    const titleElement = document.querySelector('.section-title');
    if (titleElement && titles[sectionName]) {
        titleElement.textContent = titles[sectionName];
    }
}

function onSectionChange(sectionName) {
    switch(sectionName) {
        case 'search':
            focusSearchInput();
            break;
        case 'image':
            focusImagePrompt();
            break;
        case 'audio':
            focusAudioText();
            break;
        case 'video':
            focusVideoPrompt();
            break;
    }
}

// ===== TOGGLE DA SIDEBAR (MOBILE) =====
function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
        
        // Fechar sidebar ao clicar fora (mobile)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }
}

// ===== ALTERNÂNCIA DE TEMA =====
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
    saveTheme(currentTheme);
    updateThemeButton();
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

function updateThemeButton() {
    const themeBtn = document.getElementById('themeToggle');
    const themeIcon = themeBtn.querySelector('.theme-icon');
    const themeText = themeBtn.querySelector('.theme-text');
    
    if (currentTheme === 'dark') {
        themeIcon.className = 'fas fa-moon theme-icon';
        themeText.textContent = 'Modo Escuro';
    } else {
        themeIcon.className = 'fas fa-sun theme-icon';
        themeText.textContent = 'Modo Claro';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    currentTheme = savedTheme;
    applyTheme(currentTheme);
    updateThemeButton();
}

function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

// ===== FUNCIONALIDADE DO CHAT =====
function setupChatFunctionality() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    
    if (chatInput) {
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        chatInput.addEventListener('input', function() {
            adjustTextareaHeight(this);
            updateSendButton();
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceRecording);
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (message && !isGenerating) {
        addMessageToChat(message, 'user');
        chatInput.value = '';
        adjustTextareaHeight(chatInput);
        updateSendButton();
        
        // Simular resposta da IA
        setTimeout(() => {
            generateAIResponse(message);
        }, 1000);
    }
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = createMessageElement(message, sender);
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Salvar no histórico
    chatHistory.push({
        message: message,
        sender: sender,
        timestamp: new Date().toISOString()
    });
    
    saveChatHistory();
}

function createMessageElement(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">Você</span>
                    <span class="message-time">${currentTime}</span>
                </div>
                <div class="message-text">
                    <p>${escapeHtml(message)}</p>
                </div>
            </div>
            <div class="message-avatar">
                <div class="avatar-icon user-avatar-icon">
                    <span>N</span>
                </div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-icon">
                    <i class="fas fa-robot"></i>
                </div>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">All in One AI</span>
                    <span class="message-time">${currentTime}</span>
                </div>
                <div class="message-text">
                    <p>${message}</p>
                </div>
                <div class="message-actions">
                    <button class="action-btn" onclick="copyMessage(this)" title="Copiar">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn" onclick="likeMessage(this)" title="Curtir">
                        <i class="fas fa-thumbs-up"></i>
                    </button>
                    <button class="action-btn" onclick="dislikeMessage(this)" title="Não curtir">
                        <i class="fas fa-thumbs-down"></i>
                    </button>
                    <button class="action-btn" onclick="speakMessage(this)" title="Reproduzir">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <button class="action-btn" onclick="downloadMessage(this)" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn" onclick="regenerateMessage(this)" title="Regenerar">
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    return messageDiv;
}

function generateAIResponse(userMessage) {
    isGenerating = true;
    showTypingIndicator();
    
    // Simular tempo de processamento
    setTimeout(() => {
        const response = getAIResponse(userMessage);
        hideTypingIndicator();
        addMessageToChat(response, 'ai');
        isGenerating = false;
    }, 2000);
}

function getAIResponse(message) {
    const responses = [
        "Entendi! Posso ajudar você com isso. O que mais gostaria de saber?",
        "Ótima pergunta! Vou explicar isso de forma detalhada para você.",
        "Claro! Vou processar essa informação e te dar uma resposta completa.",
        "Interessante! Deixe-me analisar isso e fornecer uma resposta útil.",
        "Perfeito! Posso ajudar você com essa tarefa. Vamos começar?"
    ];
    
    // Respostas específicas para certas palavras-chave
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('tema') || lowerMessage.includes('escuro') || lowerMessage.includes('claro')) {
        return "Para alternar entre os temas claro e escuro, você pode clicar no botão de tema na sidebar ou usar o atalho <strong>Ctrl + Shift + T</strong>. O tema será salvo automaticamente! 🌙☀️";
    }
    
    if (lowerMessage.includes('imagem') || lowerMessage.includes('gerar')) {
        return "Para gerar imagens, vá para a seção <strong>Imagem</strong> na sidebar, descreva o que você quer criar e clique em <strong>Gerar Imagem</strong>. Você pode ajustar a resolução, modelo e outras configurações! 🎨";
    }
    
    if (lowerMessage.includes('áudio') || lowerMessage.includes('voz')) {
        return "Na seção <strong>Voz</strong>, você pode converter texto em fala natural! Escolha entre modo single-speaker ou multi-speaker, ajuste a temperatura e selecione diferentes vozes. 🎵";
    }
    
    if (lowerMessage.includes('vídeo')) {
        return "A geração de vídeo permite criar clipes incríveis! Configure o modelo, duração, resolução e proporção. Você também pode ativar efeitos sonoros e voz. 🎬";
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <div class="avatar-icon">
                <i class="fas fa-robot"></i>
            </div>
        </div>
        <div class="message-content">
            <div class="message-text">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function toggleVoiceRecording() {
    const voiceBtn = document.getElementById('voiceBtn');
    const icon = voiceBtn.querySelector('i');
    
    if (!isRecording) {
        // Iniciar gravação
        isRecording = true;
        icon.className = 'fas fa-stop';
        voiceBtn.style.background = '#f44336';
        showToast('Gravação iniciada...', 'success');
        
        // Simular gravação
        setTimeout(() => {
            stopVoiceRecording();
        }, 3000);
    } else {
        stopVoiceRecording();
    }
}

function stopVoiceRecording() {
    const voiceBtn = document.getElementById('voiceBtn');
    const icon = voiceBtn.querySelector('i');
    const chatInput = document.getElementById('chatInput');
    
    isRecording = false;
    icon.className = 'fas fa-microphone';
    voiceBtn.style.background = '';
    
    // Simular transcrição
    const transcriptions = [
        "Olá, como você está hoje?",
        "Pode me ajudar com uma tarefa?",
        "Quero gerar uma imagem",
        "Como funciona a geração de áudio?"
    ];
    
    const transcription = transcriptions[Math.floor(Math.random() * transcriptions.length)];
    chatInput.value = transcription;
    adjustTextareaHeight(chatInput);
    updateSendButton();
    
    showToast('Gravação transcrita!', 'success');
}

function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function updateSendButton() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    
    if (chatInput.value.trim()) {
        sendBtn.style.opacity = '1';
        sendBtn.style.transform = 'scale(1)';
    } else {
        sendBtn.style.opacity = '0.6';
        sendBtn.style.transform = 'scale(0.9)';
    }
}

// ===== AÇÕES DAS MENSAGENS =====
function copyMessage(button) {
    const messageText = button.closest('.message-content').querySelector('.message-text').textContent;
    navigator.clipboard.writeText(messageText).then(() => {
        showToast('Mensagem copiada!', 'success');
    });
}

function likeMessage(button) {
    const icon = button.querySelector('i');
    if (icon.classList.contains('fas')) {
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.style.color = '';
    } else {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.style.color = '#4caf50';
    }
}

function dislikeMessage(button) {
    const icon = button.querySelector('i');
    if (icon.classList.contains('fas')) {
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.style.color = '';
    } else {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.style.color = '#f44336';
    }
}

function speakMessage(button) {
    const messageText = button.closest('.message-content').querySelector('.message-text').textContent;
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(messageText);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
        showToast('Reproduzindo mensagem...', 'success');
    } else {
        showToast('Síntese de voz não suportada', 'error');
    }
}

function downloadMessage(button) {
    const messageText = button.closest('.message-content').querySelector('.message-text').textContent;
    const blob = new Blob([messageText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mensagem.txt';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Mensagem baixada!', 'success');
}

function regenerateMessage(button) {
    const messageElement = button.closest('.message');
    const messageText = messageElement.querySelector('.message-text p').textContent;
    
    // Simular regeneração
    showToast('Regenerando resposta...', 'success');
    setTimeout(() => {
        const newResponse = getAIResponse("regenerar: " + messageText);
        messageElement.querySelector('.message-text p').textContent = newResponse;
        showToast('Resposta regenerada!', 'success');
    }, 2000);
}

// ===== FUNCIONALIDADE DE BUSCA =====
function setupSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    
    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (searchClear) {
        searchClear.addEventListener('click', clearSearch);
    }
}

function focusSearchInput() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        setTimeout(() => searchInput.focus(), 100);
    }
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    const resultsContainer = document.getElementById('searchResults');
    
    if (query.length === 0) {
        showSearchPlaceholder();
        return;
    }
    
    // Simular busca
    const results = searchInChatHistory(query);
    displaySearchResults(results);
}

function searchInChatHistory(query) {
    const results = chatHistory.filter(item => 
        item.message.toLowerCase().includes(query.toLowerCase())
    );
    
    // Adicionar alguns resultados simulados se não houver histórico
    if (results.length === 0) {
        return [
            {
                message: `Resultado simulado para "${query}"`,
                sender: 'ai',
                timestamp: new Date().toISOString()
            },
            {
                message: `Outra conversa relacionada a "${query}"`,
                sender: 'user',
                timestamp: new Date().toISOString()
            }
        ];
    }
    
    return results;
}

function displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-placeholder">
                <i class="fas fa-search"></i>
                <p>Nenhum resultado encontrado</p>
            </div>
        `;
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="search-result-item">
            <div class="result-header">
                <span class="result-sender">${result.sender === 'user' ? 'Você' : 'All in One AI'}</span>
                <span class="result-time">${new Date(result.timestamp).toLocaleDateString('pt-BR')}</span>
            </div>
            <div class="result-text">${escapeHtml(result.message)}</div>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = resultsHTML;
}

function showSearchPlaceholder() {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = `
        <div class="search-placeholder">
            <i class="fas fa-search"></i>
            <p>Digite algo para buscar nos seus chats...</p>
        </div>
    `;
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    showSearchPlaceholder();
    searchInput.focus();
}

// ===== GERAÇÃO DE IMAGEM =====
function setupImageGeneration() {
    const generateBtn = document.getElementById('generateImageBtn');
    const referenceUpload = document.getElementById('referenceUpload');
    const referenceInput = document.getElementById('referenceInput');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', generateImage);
    }
    
    if (referenceUpload && referenceInput) {
        referenceUpload.addEventListener('click', () => referenceInput.click());
        referenceInput.addEventListener('change', handleReferenceUpload);
    }
}

function focusImagePrompt() {
    const imagePrompt = document.getElementById('imagePrompt');
    if (imagePrompt) {
        setTimeout(() => imagePrompt.focus(), 100);
    }
}

function generateImage() {
    const prompt = document.getElementById('imagePrompt').value.trim();
    
    if (!prompt) {
        showToast('Por favor, descreva a imagem que você quer gerar', 'error');
        return;
    }
    
    showLoading('Gerando imagem...');
    
    // Simular geração de imagem
    setTimeout(() => {
        hideLoading();
        addGeneratedImage(prompt);
        showToast('Imagem gerada com sucesso!', 'success');
    }, 3000);
}

function addGeneratedImage(prompt) {
    const resultsSection = document.getElementById('imageResults');
    const imageUrl = `https://picsum.photos/400/400?random=${Date.now()}`;
    
    const resultHTML = `
        <div class="result-item">
            <div class="result-image">
                <img src="${imageUrl}" alt="Imagem gerada">
                <div class="result-overlay">
                    <button class="overlay-btn" onclick="downloadImage('${imageUrl}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="overlay-btn" onclick="shareImage('${imageUrl}')" title="Compartilhar">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="overlay-btn" onclick="editImage('${imageUrl}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
            <div class="result-info">
                <span class="result-date">Agora</span>
                <span class="result-size">400 x 400 (1:1)</span>
            </div>
        </div>
    `;
    
    resultsSection.innerHTML = resultHTML;
}

function handleReferenceUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const referenceUpload = document.getElementById('referenceUpload');
            referenceUpload.innerHTML = `
                <img src="${e.target.result}" alt="Referência" style="max-width: 100%; max-height: 100px; object-fit: cover; border-radius: 8px;">
                <span>Imagem de referência carregada</span>
            `;
        };
        reader.readAsDataURL(file);
        showToast('Imagem de referência carregada!', 'success');
    }
}

function downloadImage(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imagem-gerada.jpg';
    a.click();
    showToast('Download iniciado!', 'success');
}

function shareImage(url) {
    if (navigator.share) {
        navigator.share({
            title: 'Imagem gerada pelo All in One',
            url: url
        });
    } else {
        navigator.clipboard.writeText(url);
        showToast('Link copiado para a área de transferência!', 'success');
    }
}

function editImage(url) {
    showToast('Funcionalidade de edição em desenvolvimento', 'success');
}

// ===== GERAÇÃO DE ÁUDIO =====
function setupAudioGeneration() {
    const generateBtn = document.getElementById('generateAudioBtn');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const quickButtons = document.querySelectorAll('.quick-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', generateAudio);
    }
    
    modeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            modeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    quickButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const prompt = this.dataset.prompt;
            const styleInstructions = document.getElementById('styleInstructions');
            if (styleInstructions) {
                styleInstructions.value = prompt;
            }
        });
    });
}

function focusAudioText() {
    const audioText = document.getElementById('audioText');
    if (audioText) {
        setTimeout(() => audioText.focus(), 100);
    }
}

function generateAudio() {
    const text = document.getElementById('audioText').value.trim();
    
    if (!text) {
        showToast('Por favor, insira o texto para gerar áudio', 'error');
        return;
    }
    
    showLoading('Gerando áudio...');
    
    // Simular geração de áudio
    setTimeout(() => {
        hideLoading();
        playGeneratedAudio(text);
        showToast('Áudio gerado com sucesso!', 'success');
    }, 2500);
}

function playGeneratedAudio(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        const voiceSelect = document.getElementById('voiceSelect');
        const temperatureSlider = document.getElementById('temperatureSlider');
        
        utterance.lang = 'pt-BR';
        utterance.rate = parseFloat(temperatureSlider.value) || 1;
        
        // Simular diferentes vozes
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            utterance.voice = voices[0];
        }
        
        speechSynthesis.speak(utterance);
    } else {
        showToast('Síntese de voz não suportada neste navegador', 'error');
    }
}

// ===== GERAÇÃO DE VÍDEO =====
function setupVideoGeneration() {
    const generateBtn = document.getElementById('generateVideoBtn');
    const randomSeedBtn = document.getElementById('randomSeedBtn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', generateVideo);
    }
    
    if (randomSeedBtn) {
        randomSeedBtn.addEventListener('click', generateRandomSeed);
    }
}

function focusVideoPrompt() {
    const videoPrompt = document.getElementById('videoPrompt');
    if (videoPrompt) {
        setTimeout(() => videoPrompt.focus(), 100);
    }
}

function generateVideo() {
    const prompt = document.getElementById('videoPrompt').value.trim();
    
    if (!prompt) {
        showToast('Por favor, descreva o vídeo que você quer criar', 'error');
        return;
    }
    
    showLoading('Criando vídeo...');
    
    // Simular geração de vídeo (tempo mais longo)
    setTimeout(() => {
        hideLoading();
        addGeneratedVideo(prompt);
        showToast('Vídeo criado com sucesso!', 'success');
    }, 5000);
}

function addGeneratedVideo(prompt) {
    const resultsSection = document.getElementById('videoResults');
    
    const resultHTML = `
        <div class="result-item">
            <div class="result-video">
                <video controls style="width: 100%; border-radius: 8px;">
                    <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4">
                    Seu navegador não suporta vídeo HTML5.
                </video>
            </div>
            <div class="result-info">
                <span class="result-date">Agora</span>
                <span class="result-size">1080P (9:16)</span>
            </div>
        </div>
    `;
    
    resultsSection.innerHTML = resultHTML;
}

function generateRandomSeed() {
    const seedInput = document.getElementById('seedInput');
    const randomSeed = Math.floor(Math.random() * 1000000000);
    seedInput.value = randomSeed;
    showToast('Semente aleatória gerada!', 'success');
}

// ===== CONFIGURAÇÃO DE ELEMENTOS INTERATIVOS =====
function setupOptionButtons() {
    const optionButtons = document.querySelectorAll('.option-btn');
    
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const group = this.closest('.setting-group');
            if (group) {
                const buttons = group.querySelectorAll('.option-btn');
                buttons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

function setupSliders() {
    const sliders = document.querySelectorAll('.setting-slider');
    
    sliders.forEach(slider => {
        const valueDisplay = slider.parentElement.querySelector('.slider-value');
        
        slider.addEventListener('input', function() {
            if (valueDisplay) {
                valueDisplay.textContent = this.value;
            }
        });
    });
}

function setupToggles() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const label = this.closest('.toggle-item').querySelector('span').textContent;
            const status = this.checked ? 'ativado' : 'desativado';
            showToast(`${label} ${status}`, 'success');
        });
    });
}

function setupFileUpload() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                showToast(`Arquivo "${file.name}" carregado!`, 'success');
            }
        });
    });
}

// ===== AUTO-RESIZE DE TEXTAREA =====
function setupTextareaAutoResize() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            adjustTextareaHeight(this);
        });
    });
}

// ===== ATALHOS DE TECLADO =====
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + K para busca
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            showSection('search');
            setActiveNavItem(document.querySelector('[data-section="search"]'));
        }
        
        // Ctrl + Shift + T para alternar tema
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            toggleTheme();
        }
        
        // Ctrl + Enter para gerar (em seções de geração)
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            
            switch(currentSection) {
                case 'image':
                    generateImage();
                    break;
                case 'audio':
                    generateAudio();
                    break;
                case 'video':
                    generateVideo();
                    break;
            }
        }
        
        // Escape para fechar sidebar (mobile)
        if (e.key === 'Escape') {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// ===== TOOLTIPS =====
function setupTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[title]');
    
    elementsWithTooltips.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('title');
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'var(--bg-elevated)';
    tooltip.style.color = 'var(--text-primary)';
    tooltip.style.padding = '6px 10px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.boxShadow = '0 2px 8px var(--shadow)';
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    e.target.tooltipElement = tooltip;
}

function hideTooltip(e) {
    if (e.target.tooltipElement) {
        e.target.tooltipElement.remove();
        e.target.tooltipElement = null;
    }
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Remover após 3 segundos
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

function showLoading(message = 'Carregando...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = loadingOverlay.querySelector('.loading-text');
    
    loadingText.textContent = message;
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('active');
}

// ===== PERSISTÊNCIA DE DADOS =====
function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function loadChatHistory() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
        chatHistory = JSON.parse(saved);
    }
}

// ===== UTILITÁRIOS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ===== RESPONSIVIDADE =====
function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
    }
}

window.addEventListener('resize', handleResize);

// ===== ANIMAÇÕES CSS ADICIONAIS =====
const style = document.createElement('style');
style.textContent = `
    .typing-dots {
        display: flex;
        gap: 4px;
        padding: 8px 0;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        background: var(--text-muted);
        border-radius: 50%;
        animation: typingDots 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typingDots {
        0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes toastSlideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .search-result-item {
        padding: 16px;
        border-bottom: 1px solid var(--border-color);
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    
    .search-result-item:hover {
        background-color: var(--bg-surface);
    }
    
    .result-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }
    
    .result-sender {
        font-weight: 600;
        color: var(--text-secondary);
        font-size: 14px;
    }
    
    .result-time {
        font-size: 12px;
        color: var(--text-muted);
    }
    
    .result-text {
        color: var(--text-primary);
        line-height: 1.5;
    }
`;

document.head.appendChild(style);

console.log('All in One AI - Sistema completo carregado! 🚀');


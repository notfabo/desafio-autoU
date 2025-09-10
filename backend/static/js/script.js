document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const landingView = document.getElementById('landing-view');
    const mainAppView = document.getElementById('main-app-view');
    const startAppBtn = document.getElementById('start-app-btn');

    const form = document.getElementById('email-form');
    const inputView = document.getElementById('input-view');
    const resultsView = document.getElementById('results-view');

    const loadingSpinner = document.getElementById('loading-spinner');
    const resultadoConteudo = document.getElementById('resultado-conteudo');
    const classificacaoSpan = document.getElementById('classificacao');
    const sugestaoDiv = document.getElementById('sugestao');

    const inputFile = document.getElementById('arquivo_email');
    const textArea = document.getElementById('texto_email');
    const selectFileBtn = document.getElementById('select-file-btn');
    const fileNameSpan = document.getElementById('file-name');
    const dropZone = document.getElementById('drop-zone');

    const formWrapper = document.getElementById('form-wrapper');
    const submitBtn = document.getElementById('submit-btn');
    const inputTitle = document.getElementById('input-title');
    const conteudoAnalisadoWrapper = document.getElementById('conteudo-analisado-wrapper');
    const conteudoAnalisadoBox = document.getElementById('conteudo-analisado-box');
    const resetBtn = document.getElementById('reset-btn');

    const dropZoneEmpty = document.getElementById('drop-zone-empty');
    const dropZoneFilled = document.getElementById('drop-zone-filled');
    const fileIcon = document.getElementById('file-icon');
    const filledFileName = document.getElementById('filled-file-name');
    const removeFileBtn = document.getElementById('remove-file-btn');

    function showWarning(message, duration = 5500) {
        function escapeHtml(unsafe) {
            return String(unsafe)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        const existing = document.querySelector('.warning-alert');
        if (existing) existing.remove();

        const el = document.createElement('div');
        el.className = 'warning-alert';
        el.setAttribute('role', 'alert');
        el.setAttribute('aria-live', 'assertive');
        el.innerHTML = `
    <div class="icon" aria-hidden="true">⚠</div>
    <div class="msg">${escapeHtml(message)}</div>
    <button class="close" aria-label="Fechar alerta">&times;</button>
  `;

        document.body.appendChild(el);

        requestAnimationFrame(() => el.classList.add('show'));

        function hide() {
            el.classList.remove('show');
            setTimeout(() => el.remove(), 240);
        }

        el.querySelector('.close').addEventListener('click', hide);

        if (duration > 0) {
            setTimeout(hide, duration);
        }
    }

    function handleFileSelection() {
        if (inputFile.files.length > 0) {
            const file = inputFile.files[0];

            if (file.name.endsWith('.pdf')) {
                fileIcon.className = 'fas fa-file-pdf filled-icon';
            } else if (file.name.endsWith('.txt')) {
                fileIcon.className = 'fas fa-file-alt filled-icon';
            } else {
                fileIcon.className = 'fas fa-file filled-icon';
            }

            filledFileName.textContent = file.name;
            dropZoneEmpty.classList.add('hidden');
            dropZoneFilled.classList.remove('hidden');
            dropZone.classList.add('drop-zone--filled');
            textArea.value = '';
        }
    }

    startAppBtn.addEventListener('click', () => {
        landingView.classList.add('fade-out');
        landingView.addEventListener('animationend', () => {
            landingView.classList.add('hidden');
            mainAppView.classList.remove('hidden');
            mainAppView.classList.add('fade-in');
        }, { once: true }); 
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        let textoParaAnalisar = '';
        if (formData.get('arquivo_email').size > 0) {
            const file = formData.get('arquivo_email');
            if (file.type === 'text/plain') {
                textoParaAnalisar = await file.text();
            } else {
                textoParaAnalisar = `Arquivo PDF: ${file.name} (conteúdo extraído no servidor).`;
            }
        } else {
            textoParaAnalisar = formData.get('texto_email');
        }

        if (textoParaAnalisar.trim() === '') {
            showWarning('Por favor, forneça o conteúdo de um email para analisar.');
            return;
        }

        container.classList.add('wide-view');
        resultsView.classList.remove('hidden');
        resultsView.classList.add('slide-in');
        loadingSpinner.classList.remove('hidden');
        resultadoConteudo.classList.add('hidden');
        inputTitle.textContent = 'Conteúdo Analisado';
        formWrapper.classList.add('hidden');
        conteudoAnalisadoWrapper.classList.remove('hidden');
        conteudoAnalisadoBox.textContent = textoParaAnalisar;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Analisado!';

        try {
            const response = await fetch('/processar', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            conteudoAnalisadoBox.textContent = result.conteudo_analisado;
            classificacaoSpan.textContent = result.classificacao;
            sugestaoDiv.textContent = result.sugestao_resposta;
            classificacaoSpan.className = 'result-badge';
            if (result.classificacao === 'Produtivo') {
                classificacaoSpan.classList.add('produtivo');
            } else if (result.classificacao === 'Improdutivo') {
                classificacaoSpan.classList.add('improdutivo');
            } else {
                classificacaoSpan.classList.add('erro');
            }
        } catch (error) {
            console.error('Erro ao processar a solicitação:', error);
            classificacaoSpan.textContent = 'Erro';
            classificacaoSpan.className = 'result-badge erro';
            sugestaoDiv.textContent = 'Ocorreu um erro de comunicação com o servidor. Verifique sua conexão e tente novamente.';
        } finally {
            loadingSpinner.classList.add('hidden');
            resultadoConteudo.classList.remove('hidden');
            resultadoConteudo.classList.add('fade-in'); 
        }
    });

    resetBtn.addEventListener('click', () => {
        resultsView.classList.add('hidden');
        conteudoAnalisadoWrapper.classList.add('hidden');
        container.classList.remove('wide-view');
        formWrapper.classList.remove('hidden');
        inputTitle.textContent = 'Envie seu Email para Análise';
        form.reset();
        inputFile.value = '';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Analisar Email';
        dropZoneFilled.classList.add('hidden');
        dropZoneEmpty.classList.remove('hidden');
        dropZone.classList.remove('drop-zone--filled');
    });

    selectFileBtn.addEventListener('click', () => inputFile.click());
    inputFile.addEventListener('change', handleFileSelection);
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drop-zone--over');
        if (e.dataTransfer.files.length) {
            inputFile.files = e.dataTransfer.files;
            handleFileSelection();
        }
    });

    removeFileBtn.addEventListener('click', () => {
        inputFile.value = '';
        dropZoneFilled.classList.add('hidden');
        dropZoneEmpty.classList.remove('hidden');
        dropZone.classList.remove('drop-zone--filled');
    });

    ['dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, e => e.preventDefault());
    });

    dropZone.addEventListener('dragover', () => dropZone.classList.add('drop-zone--over'));
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drop-zone--over'));

    dropZone.addEventListener('drop', (e) => {
        dropZone.classList.remove('drop-zone--over');
        if (e.dataTransfer.files.length) {
            inputFile.files = e.dataTransfer.files;
            fileNameSpan.textContent = inputFile.files[0].name;
            textArea.value = '';
        }
    });

    textArea.addEventListener('input', () => {
        if (textArea.value.trim() !== '') {
            inputFile.value = '';
            fileNameSpan.textContent = 'Nenhum arquivo selecionado';
        }
    });
});
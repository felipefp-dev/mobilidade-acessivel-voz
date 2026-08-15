// Seleção dos elementos da página
const btnMic = document.getElementById('btn-mic');
const statusMicText = document.getElementById('status-mic'); // Novo elemento de status
const inputEndereco = document.getElementById('endereco');
const areaConfirmacao = document.getElementById('area-confirmacao');
const mensagemVoz = document.getElementById('mensagem-voz');
const btnConfirmar = document.getElementById('btn-confirmar');
const btnRepetir = document.getElementById('btn-repetir');

// Verifica se o navegador suporta a API de Reconhecimento de Voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR'; // Configura para português do Brasil

    // Evento quando o usuário clica no botão de microfone
    btnMic.addEventListener('click', () => {
        // --- Atualização Visual: Ativa animação e muda status ---
        btnMic.classList.add('ouvindo');
        statusMicText.textContent = "Ouvindo... Fale agora";
        inputEndereco.value = ""; // Limpa o campo
        areaConfirmacao.classList.add('escondido'); // Esconde confirmação antiga se houver
        // ---------------------------------------------------------
        
        recognition.start();
    });

    // Quando o navegador captura a fala com sucesso
    recognition.onresult = (event) => {
        const textoCapturado = event.results[0][0].transcript;
        inputEndereco.value = textoCapturado;
        
        // --- Atualização Visual: Desativa animação e muda status ---
        btnMic.classList.remove('ouvindo');
        statusMicText.textContent = "Toque para falar novamente";
        // ---------------------------------------------------------

        // Exibe a área de confirmação
        areaConfirmacao.classList.remove('escondido');
        mensagemVoz.textContent = `"${textoCapturado}"`; // Mostra apenas o endereço no card

        // Função de Acessibilidade: Lê o destino em voz alta para o idoso
        falarVozAlta(`Entendi: ${textoCapturado}. Confirma esse destino?`);
    };

    // Tratamento de erro (caso ele não fale nada)
    recognition.onerror = (event) => {
        btnMic.classList.remove('ouvindo');
        statusMicText.textContent = "Não entendi. Toque para tentar de novo.";
        falarVozAlta("Desculpe, não consegui entender o destino. Por favor, tente falar novamente.");
    };


    // Função para fazer o computador falar (Text-to-Speech)
    function falarVozAlta(texto) {
        if ('speechSynthesis' in window) {
            // Cancela falas anteriores para não sobrepor
            window.speechSynthesis.cancel();
            const fala = new SpeechSynthesisUtterance(texto);
            fala.lang = 'pt-BR';
            fala.rate = 0.9; // Velocidade um pouquinho mais lenta para clareza
            window.speechSynthesis.speak(fala);
        }
    }

    // Ações dos botões de confirmação
    btnConfirmar.addEventListener('click', () => {
        areaConfirmacao.classList.add('escondido');
        falarVozAlta("Corrida solicitada com sucesso! Aguarde o motorista.");
        alert("✅ Corrida solicitada com sucesso!");
    });

    btnRepetir.addEventListener('click', () => {
        areaConfirmacao.classList.add('escondido');
        inputEndereco.value = "";
        statusMicText.textContent = "Toque para falar";
        falarVozAlta("Por favor, clique no botão central e fale o destino novamente.");
    });

} else {
    // Fallback caso o navegador não suporte
    statusMicText.textContent = "Navegador não suportado";
    btnMic.style.display = 'none';
    inputEndereco.readOnly = false; // Permite digitar
    inputEndereco.placeholder = "Seu navegador não suporta voz. Digite aqui.";
    alert("Ops! Seu navegador não suporta reconhecimento de voz. O Google Chrome é recomendado.");
}
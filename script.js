const API_URL = 'http://localhost:3000';

// ==========================================
// 1. NAVEGAÇÃO ENTRE ECRÃS / PASSOS
// ==========================================

function goToStepPhone() {
    document.getElementById('step-password').classList.remove('active');
    document.getElementById('step-chat').classList.remove('active');
    document.getElementById('step-phone').classList.add('active');
}

function goToStepSenha() {
    const telefone = document.getElementById('loginTelefone').value.trim();
    if (!telefone) {
        alert('Por favor, informe o número de telefone.');
        return;
    }
    document.getElementById('step-phone').classList.remove('active');
    document.getElementById('step-password').classList.add('active');
}

function goToStepChat() {
    document.getElementById('step-phone').classList.remove('active');
    document.getElementById('step-password').classList.remove('active');
    document.getElementById('step-chat').classList.add('active');

    const meuTelefone = sessionStorage.getItem('usuarioTelefone');
    if (meuTelefone) {
        const displayUser = document.getElementById('display-user-phone');
        if (displayUser) {
            displayUser.innerText = `Usuário: ${meuTelefone}`;
        }
    }
}

function fazerLogout() {
    sessionStorage.clear();
    if (document.getElementById('loginSenha')) {
        document.getElementById('loginSenha').value = '';
    }
    goToStepPhone();
}

// ==========================================
// 2. AUTENTICAÇÃO / LOGIN (POST /auth)
// ==========================================

async function realizarLogin() {
    const telefone = document.getElementById('loginTelefone').value.trim();
    const senha = document.getElementById('loginSenha').value.trim();

    if (!telefone || !senha) {
        alert('Por favor, preencha o telefone e a senha.');
        return;
    }

    try {
        const url = `${API_URL}/auth?telefone=${encodeURIComponent(telefone)}&senha=${encodeURIComponent(senha)}`;

        const resposta = await fetch(url, { method: 'POST' });
        const dados = await resposta.json();

        if (resposta.ok && dados.isAuth) {
            sessionStorage.setItem('usuarioTelefone', telefone);
            alert('Login efetuado com sucesso!');
            goToStepChat();
        } else {
            alert('Falha no login: ' + (dados.mensagem || 'Credenciais inválidas.'));
        }
    } catch (erro) {
        console.error('Erro na autenticação:', erro);
        alert('Falha ao conectar com o servidor da API.');
    }
}

// ==========================================
// 3. ENVIO E RENDERIZAÇÃO DE MENSAGENS (POST /chat)
// ==========================================

async function enviarMensagem() {
    const telefoneDestino = document.getElementById('destinatario').value.trim();
    const mensagem = document.getElementById('textoMensagem').value.trim();

    if (!telefoneDestino || !mensagem) {
        alert('Por favor, preencha o destinatário e a mensagem.');
        return;
    }

    // Obtém o telefone do utilizador logado no sessionStorage
    const meuTelefone = sessionStorage.getItem('usuarioTelefone') || '18997057854';

    const dadosMensagem = {
        telefone: telefoneDestino,
        mensagem: mensagem
    };

    try {
        const url = `${API_URL}/chat?telefone=${encodeURIComponent(meuTelefone)}`;

        const resposta = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(dadosMensagem)
        });

        const dadosRetorno = await resposta.json();

        if (resposta.ok) {
            adicionarBalaoMensagem(mensagem);
            document.getElementById('textoMensagem').value = '';
        } else {
            alert('Falha no envio: ' + (dadosRetorno.mensagem || 'Erro no servidor.'));
        }
    } catch (erro) {
        console.error('Erro no envio:', erro);
        alert('Falha ao conectar com a API.');
    }
}

function adicionarBalaoMensagem(texto) {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;

    const horaAtual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msgDiv = document.createElement('div');
    msgDiv.className = 'message-bubble sent';
    msgDiv.innerHTML = `${texto} <span class="time">${horaAtual}</span>`;

    chatArea.appendChild(msgDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}   
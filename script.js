/**
 * ============================================================================
 * _STUDIO_GABYY_NAILS - LÓGICA JAVASCRIPT (FRONT-END)
 * ============================================================================
 * Funcionalidades:
 * 1. Integração completa com WhatsApp (captura de dados e envio sem recarregar a página).
 * 2. Máscara automática de telefone para formato brasileiro (XX) XXXXX-XXXX.
 * 3. Validação dos campos com mensagens amigáveis de erro.
 * 4. Pré-seleção do serviço ao clicar nos cartões da seção "Nossos Serviços".
 * 5. Bloqueio de datas passadas no seletor de agendamento.
 * 6. Menu mobile responsivo e ano automático no rodapé.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. CONFIGURAÇÃO DOS CONTATOS
  // ==========================================================================
  // Número de WhatsApp da Manicure / Estúdio (para agendamentos de unhas):
  const WHATSAPP_NUMERO = '5583993248009';

  // DADOS DO DESENVOLVEDOR (VICTOR - CRIAÇÃO DE SITES):
  const WHATSAPP_DEV = '5521970253042'; 
  const NOME_DEV = 'Victor';
  const INSTA_DEV = 'vitorrj_dev';

  // ==========================================================================
  // 2. ELEMENTOS DO DOM (FORMULÁRIO E CAMPOS)
  // ==========================================================================
  const formAgendamento = document.getElementById('formAgendamento');
  const inputNome = document.getElementById('clienteNome');
  const inputTelefone = document.getElementById('clienteTelefone');
  const selectServico = document.getElementById('clienteServico');
  const inputData = document.getElementById('clienteData');
  const selectHorario = document.getElementById('clienteHorario');
  const textareaObs = document.getElementById('clienteObs');

  // ==========================================================================
  // 3. BLOQUEAR DATAS PASSADAS NO CAMPO DE DATA
  // ==========================================================================
  // Impede que a cliente selecione uma data anterior ao dia de hoje
  if (inputData) {
    const hoje = new Date().toISOString().split('T')[0];
    inputData.setAttribute('min', hoje);
  }

  // ==========================================================================
  // 4. MÁSCARA INTELIGENTE PARA TELEFONE / WHATSAPP: (83) 99999-9999
  // ==========================================================================
  if (inputTelefone) {
    inputTelefone.addEventListener('input', (e) => {
      let valor = e.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito
      
      // Limita a 11 dígitos (DDD + 9 dígitos)
      if (valor.length > 11) {
        valor = valor.slice(0, 11);
      }

      // Aplica a formatação passo a passo
      if (valor.length > 10) {
        // Formato com 9 dígitos: (XX) XXXXX-XXXX
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (valor.length > 6) {
        // Formato intermediário: (XX) XXXX-XXXX
        valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (valor.length > 2) {
        // Apenas DDD: (XX) XXX...
        valor = valor.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (valor.length > 0) {
        valor = valor.replace(/^(\d*)$/, '($1');
      }

      e.target.value = valor;
      limparErro(inputTelefone);
    });
  }

  // ==========================================================================
  // 5. LIMPEZA AUTOMÁTICA DE ERRO AO DIGITAR
  // ==========================================================================
  [inputNome, selectServico, inputData, selectHorario].forEach(campo => {
    if (campo) {
      campo.addEventListener('input', () => limparErro(campo));
      campo.addEventListener('change', () => limparErro(campo));
    }
  });

  function exibirErro(campoElemento) {
    const parent = campoElemento.closest('.form-group');
    if (parent) {
      parent.classList.add('has-error');
    }
  }

  function limparErro(campoElemento) {
    const parent = campoElemento.closest('.form-group');
    if (parent) {
      parent.classList.remove('has-error');
    }
  }

  // ==========================================================================
  // 6. FORMATAÇÃO DA DATA PARA O PADRÃO BRASILEIRO (DD/MM/AAAA)
  // ==========================================================================
  function formatarDataBR(dataISO) {
    if (!dataISO) return '';
    const partes = dataISO.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataISO;
  }

  // ==========================================================================
  // 7. SUBMISSÃO DO FORMULÁRIO & ENVIO PARA WHATSAPP
  // ==========================================================================
  if (formAgendamento) {
    formAgendamento.addEventListener('submit', (event) => {
      // Impede o recarregamento padrão da página (Single Page Application)
      event.preventDefault();

      let formularioValido = true;

      // Validação do Nome (pelo menos 3 caracteres)
      const nome = inputNome.value.trim();
      if (!nome || nome.length < 3) {
        exibirErro(inputNome);
        formularioValido = false;
      } else {
        limparErro(inputNome);
      }

      // Validação do Telefone (mínimo de 10 dígitos numéricos)
      const telefoneLimpo = inputTelefone.value.replace(/\D/g, '');
      if (telefoneLimpo.length < 10) {
        exibirErro(inputTelefone);
        formularioValido = false;
      } else {
        limparErro(inputTelefone);
      }

      // Validação do Serviço
      const servico = selectServico.value;
      if (!servico) {
        exibirErro(selectServico);
        formularioValido = false;
      } else {
        limparErro(selectServico);
      }

      // Validação da Data
      const data = inputData.value;
      if (!data) {
        exibirErro(inputData);
        formularioValido = false;
      } else {
        limparErro(inputData);
      }

      // Validação do Horário
      const horario = selectHorario.value;
      if (!horario) {
        exibirErro(selectHorario);
        formularioValido = false;
      } else {
        limparErro(selectHorario);
      }

      // Se algum campo obrigatório estiver inválido, interrompe o fluxo
      if (!formularioValido) {
        // Encontra o primeiro campo com erro e foca nele
        const primeiroErro = document.querySelector('.form-group.has-error input, .form-group.has-error select');
        if (primeiroErro) {
          primeiroErro.focus();
        }
        return;
      }

      // Captura observação (ou define padrão caso vazia)
      const obs = textareaObs.value.trim() || 'Nenhuma';
      const dataFormatada = formatarDataBR(data);

      // ======================================================================
      // MONTAGEM DA MENSAGEM DO WHATSAPP (ORGANIZADA E COM EMOJIS)
      // ======================================================================
      const mensagemWhatsApp = 
`✨ *SOLICITAÇÃO DE AGENDAMENTO* ✨
*Studio:* _studio_gabyy_nails

Olá! Gostaria de agendar um horário com os seguintes dados:

👤 *Cliente:* ${nome}
📱 *Telefone/WhatsApp:* ${inputTelefone.value.trim()}
💅 *Procedimento:* ${servico}
📅 *Data preferencial:* ${dataFormatada}
⏰ *Período/Horário:* ${horario}
📝 *Observações:* ${obs}

Podemos confirmar este horário? Fico no aguardo, obrigada! 💖`;

      // Codifica a mensagem para formato de URL segura
      const mensagemCodificada = encodeURIComponent(mensagemWhatsApp);

      // Link final da API oficial do WhatsApp
      const linkWhatsApp = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensagemCodificada}`;

      // Abre a conversa do WhatsApp em uma nova aba
      window.open(linkWhatsApp, '_blank');
    });
  }

  // ==========================================================================
  // 8. INTERATIVIDADE NOS CARTÕES DE SERVIÇOS & GALERIA
  // Ao clicar em "Agendar este serviço" ou "Agendar este modelo", rola
  // suavemente até o formulário e já seleciona aquele serviço no menu dropdown!
  // ==========================================================================
  const botoesServico = document.querySelectorAll('.btn-card-select, .btn-gallery-book');
  botoesServico.forEach(btn => {
    btn.addEventListener('click', () => {
      const nomeServico = btn.getAttribute('data-servico');
      
      if (selectServico && nomeServico) {
        selectServico.value = nomeServico;
        limparErro(selectServico);
      }

      // Rola suavemente até o formulário de agendamento
      const secaoAgendamento = document.getElementById('agendamento');
      if (secaoAgendamento) {
        secaoAgendamento.scrollIntoView({ behavior: 'smooth' });
        // Foca no campo de nome para a cliente começar a digitar
        setTimeout(() => {
          if (inputNome) inputNome.focus();
        }, 600);
      }
    });
  });

  // ==========================================================================
  // 9. MENU MOBILE (HAMBURGUER)
  // ==========================================================================
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icone = navToggle.querySelector('i');
      if (icone) {
        icone.classList.toggle('fa-bars');
        icone.classList.toggle('fa-xmark');
      }
    });

    // Fecha o menu ao clicar em qualquer link de navegação
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icone = navToggle.querySelector('i');
        if (icone) {
          icone.classList.add('fa-bars');
          icone.classList.remove('fa-xmark');
        }
      });
    });
  }

  // ==========================================================================
  // 10. SOMBRA NA BARRA DE NAVEGAÇÃO AO ROLAR A PÁGINA
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  // ==========================================================================
  // 11. ANO ATUAL AUTOMÁTICO NO RODAPÉ
  // ==========================================================================
  const spanAno = document.getElementById('anoAtual');
  if (spanAno) {
    spanAno.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // 12. RECUPERAÇÃO AUTOMÁTICA DE IMAGENS (COMPATIBILIDADE GITHUB PAGES)
  // Caso as imagens no GitHub Pages tenham sido enviadas para a raiz do repositório
  // ou a extensão variar entre .jpeg e .jpg, este script recupera automaticamente!
  // ==========================================================================
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      const srcOriginal = this.getAttribute('src');
      if (!srcOriginal || this.dataset.triedFallback === 'done') return;

      if (!this.dataset.triedCount) this.dataset.triedCount = '0';
      const count = parseInt(this.dataset.triedCount);

      // Tentativa 1: se estava em ./image/nome.ext, tenta na raiz ./nome.ext
      if (count === 0 && srcOriginal.includes('image/')) {
        this.dataset.triedCount = '1';
        this.src = srcOriginal.replace(/(\.\/)?image\//, './');
        return;
      }

      // Tentativa 2: alternar entre .jpeg e .jpg
      if (count <= 1) {
        this.dataset.triedCount = '2';
        if (this.src.endsWith('.jpeg')) {
          this.src = this.src.replace(/\.jpeg$/, '.jpg');
          return;
        } else if (this.src.endsWith('.jpg')) {
          this.src = this.src.replace(/\.jpg$/, '.jpeg');
          return;
        }
      }

      this.dataset.triedFallback = 'done';
    });
  });

  // Garante imagem de fundo da Hero se a pasta image não for encontrada
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    const bgTest = new Image();
    bgTest.onerror = () => {
      heroSection.style.backgroundImage = "linear-gradient(135deg, rgba(253, 241, 243, 0.92) 0%, rgba(247, 228, 231, 0.88) 50%, rgba(245, 237, 230, 0.92) 100%), url('./unha-natural-rosa.jpeg'), url('./unha-natural-rosa.jpg')";
    };
    bgTest.src = './image/unha-natural-rosa.jpeg';
  }

  // ==========================================================================
  // 13. DIVULGAÇÃO DO SERVIÇO DE CRIAÇÃO DE SITES (PROSPECÇÃO DE CLIENTES)
  // Ao clicar no banner ou no crédito do rodapé, abre o WhatsApp do desenvolvedor
  // com mensagem pronta solicitando orçamento de site!
  // ==========================================================================
  const nomeDevDisplay = document.getElementById('nomeDevDisplay');
  if (nomeDevDisplay && NOME_DEV) {
    nomeDevDisplay.textContent = NOME_DEV;
  }

  const btnDevWhatsapp = document.getElementById('btnDevWhatsapp');
  const linkDevCredit = document.getElementById('linkDevCredit');

  function abrirWhatsAppDev(e) {
    e.preventDefault();
    const mensagemDev = encodeURIComponent(
      "Olá! Vi o site profissional da _studio_gabyy_nails que você desenvolveu e gostei muito. Gostaria de solicitar um orçamento para criar um site para o meu negócio!"
    );
    window.open(`https://wa.me/${WHATSAPP_DEV}?text=${mensagemDev}`, '_blank');
  }

  if (btnDevWhatsapp) btnDevWhatsapp.addEventListener('click', abrirWhatsAppDev);
  if (linkDevCredit) linkDevCredit.addEventListener('click', abrirWhatsAppDev);

});


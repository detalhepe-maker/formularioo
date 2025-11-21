// script.js

// Configurações iniciais
const PRODUTOS_INICIAIS = [
    { id: 1, nome: 'Kit Escolar Premium', preco: 190.00 }
    { id: 2, nome: 'Kit Escolar', preco: 155.00 },
    { id: 3, nome: 'Kit Escolar sem Tag', preco: 130.00 },
    { id: 4, nome: 'Kit Petit', preco: 110.00 },
    { id: 5, nome: 'Kit Petit sem Tag', preco: 100.00 },
    { id: 6, nome: 'Kit Baby Plus', preco: 120.00 },
    { id: 7, nome: 'Kit Baby', preco: 75.00 },
    { id: 8, nome: 'Casadinha Termocolantes', preco: 85.00 },
    { id: 9, nome: 'Cartela 20 Termocolantes', preco: 45.00 },
    { id: 10, nome: 'Cartela 45 Minis Termocolantes', preco: 45.00 },
    { id: 11, nome: 'Kit Casadinha - 2 cartelas', preco: 65.00 },
    { id: 12, nome: 'Tag Mochila/Lancheira', preco: 22.00 },
    { id: 13, nome: 'Tag Estojo', preco: 16.00 },
    { id: 14, nome: 'Garrafa Térmica 350ml', preco: 85.00 },
    { id: 15, nome: 'Ecobag Meu Material - 45x40cm', preco: 55.00 },
    { id: 16, nome: 'Cartela Kit Higiene Padrão transparente', preco: 20.00 },
    { id: 17, nome: 'Cartela Kit Higiene Personalizada', preco: 30.00 },
    { id: 18, nome: 'Cartela extra Avulsa Etiquetas', preco: 27.00 },
    
];

const OPCOES_ENTREGA = [
    { id: 'retirada', label: 'Retirada na loja do Espinheiro', valor: 0 },
    { id: 'motoboy_recife', label: 'Motoboy Recife', valor: 14.00 },
    { id: 'motoboy_olinda', label: 'Motoboy Olinda', valor: 22.00 },
    { id: 'motoboy_jaboatao', label: 'Motoboy Jaboatão', valor: 27.00 },
    { id: 'correios', label: 'Correios - valor para etiquetas', valor: 16.00 },
];

const TAXA_NOVA_ARTE = 20.00;

// Estado da aplicação
let produtos = [...PRODUTOS_INICIAIS];
let criancas = [];
let criancaIdCounter = 1;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    adicionarCrianca();
    inicializarOpcoesEntrega();
    inicializarEventListeners();
});

// Event Listeners
function inicializarEventListeners() {
    document.getElementById('addCrianca').addEventListener('click', adicionarCrianca);
    document.getElementById('enviarWhatsApp').addEventListener('click', enviarWhatsApp);
    document.addEventListener('input', calcularTotal);
    document.addEventListener('change', calcularTotal);
}

// ============== CRIANÇAS ==============

function adicionarCrianca() {
    if (criancas.length >= 3) {
        alert('Máximo de 3 crianças permitido!');
        return;
    }
    
    const id = criancaIdCounter++;
    const crianca = {
        id,
        nomeCrianca: '',
        nomeAbreviado: '',
        tema: '',
        tipoTema: '',
        imagemBase64: null,
        referenciaNovaArte: '',
        produtos: [{ produtoId: '', quantidade: 1 }],
        escola: '',
        serie: '',
        turma: ''
    };
    
    criancas.push(crianca);
    renderizarCrianca(crianca);
    atualizarBotaoAddCrianca();
}

function renderizarCrianca(crianca) {
    const container = document.getElementById('criancasContainer');
    const index = criancas.indexOf(crianca);
    
    const section = document.createElement('div');
    section.className = 'section section-crianca';
    section.id = `crianca-${crianca.id}`;
    section.innerHTML = `
        <div class="crianca-header">
            <h2>Criança ${index + 1}</h2>
            ${criancas.length > 1 ? `<button class="btn-remove" onclick="removerCrianca(${crianca.id})">🗑️ Remover</button>` : ''}
        </div>
        
        <div class="form-grid">
            <div class="form-group">
                <label>Nome Completo da Criança *</label>
                <input type="text" data-crianca="${crianca.id}" data-campo="nomeCrianca" value="${crianca.nomeCrianca}">
            </div>
            <div class="form-group">
                <label>Nome Abreviado (opcional)</label>
                <input type="text" data-crianca="${crianca.id}" data-campo="nomeAbreviado" value="${crianca.nomeAbreviado}" placeholder="Caso o nome não caiba">
            </div>
        </div>
        
        <div class="form-group">
            <label>Tema *</label>
            <input type="text" data-crianca="${crianca.id}" data-campo="tema" value="${crianca.tema}" placeholder="Ex: Unicórnio, Dinossauros, Super-heróis...">
        </div>
        
        <div class="tipo-tema">
            <h3>Tipo de Arte *</h3>
            
            <label class="tema-opcao catalogo">
                <input type="radio" name="tipoTema-${crianca.id}" value="catalogo" data-crianca="${crianca.id}" data-campo="tipoTema">
                <div class="tema-opcao-content">
                    <div class="tema-opcao-titulo">📋 Tema do Catálogo</div>
                    <div class="tema-opcao-desc">Escolha um dos temas disponíveis no nosso catálogo</div>
                </div>
            </label>
            
            <label class="tema-opcao nova-arte">
                <input type="radio" name="tipoTema-${crianca.id}" value="nova_arte" data-crianca="${crianca.id}" data-campo="tipoTema">
                <div class="tema-opcao-content">
                    <div class="tema-opcao-titulo">✨ Nova Arte Personalizada</div>
                    <div class="tema-opcao-desc">Criamos uma arte exclusiva para você</div>
                    <div class="tema-opcao-preco">+ R$ ${TAXA_NOVA_ARTE.toFixed(2)}</div>
                </div>
            </label>
            
            <div id="uploadArea-${crianca.id}"></div>
        </div>
        
        <div class="produtos-crianca">
            <label>Produtos *</label>
            <div id="produtosCrianca-${crianca.id}"></div>
            <button class="btn-add-produto" onclick="adicionarProdutoCrianca(${crianca.id})">
                ➕ Adicionar outro produto
            </button>
        </div>
        
        <div class="info-adicionais">
            <h4>Informações Adicionais (opcional)</h4>
            <div class="form-grid">
                <input type="text" data-crianca="${crianca.id}" data-campo="escola" placeholder="Escola" value="${crianca.escola}">
                <input type="text" data-crianca="${crianca.id}" data-campo="serie" placeholder="Série" value="${crianca.serie}">
                <input type="text" data-crianca="${crianca.id}" data-campo="turma" placeholder="Turma" value="${crianca.turma}">
            </div>
        </div>
    `;
    
    container.appendChild(section);
    
    // Event listeners para radio buttons de tipo de tema
    section.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            atualizarCriancaCampo(crianca.id, 'tipoTema', this.value);
            renderizarUploadArea(crianca.id);
            calcularTotal();
        });
    });
    
    // Event listeners para inputs
    section.querySelectorAll('input[data-crianca]').forEach(input => {
        if (input.type !== 'radio') {
            input.addEventListener('input', function() {
                atualizarCriancaCampo(crianca.id, this.dataset.campo, this.value);
            });
        }
    });
    
    renderizarProdutosCrianca(crianca.id);
}

function removerCrianca(id) {
    if (!confirm('Deseja realmente remover esta criança?')) return;
    
    criancas = criancas.filter(c => c.id !== id);
    document.getElementById(`crianca-${id}`).remove();
    
    // Renumerar crianças
    criancas.forEach((c, index) => {
        const section = document.getElementById(`crianca-${c.id}`);
        const h2 = section.querySelector('h2');
        h2.textContent = `Criança ${index + 1}`;
    });
    
    atualizarBotaoAddCrianca();
    calcularTotal();
}

function atualizarCriancaCampo(id, campo, valor) {
    const crianca = criancas.find(c => c.id === id);
    if (crianca) {
        crianca[campo] = valor;
    }
}

function atualizarBotaoAddCrianca() {
    const btn = document.getElementById('addCrianca');
    if (criancas.length >= 3) {
        btn.classList.add('hidden');
    } else {
        btn.classList.remove('hidden');
    }
}

// ============== UPLOAD DE IMAGEM ==============

function renderizarUploadArea(criancaId) {
    const crianca = criancas.find(c => c.id === criancaId);
    if (!crianca || !crianca.tipoTema) return;
    
    const container = document.getElementById(`uploadArea-${criancaId}`);
    
    if (crianca.tipoTema === 'catalogo') {
        container.innerHTML = `
            <div class="upload-area catalogo">
                <label class="upload-label">📸 Envie o print do tema escolhido *</label>
                <p class="upload-desc">Tire um print da página do catálogo com o tema escolhido</p>
                <div id="uploadBox-${criancaId}">
                    ${crianca.imagemBase64 ? 
                        `<div class="image-preview">
                            <img src="${crianca.imagemBase64}" alt="Preview">
                            <button class="btn-remove-image" onclick="removerImagem(${criancaId})">✖</button>
                        </div>` :
                        `<label class="upload-box catalogo">
                            <input type="file" accept="image/*" onchange="handleImageUpload(${criancaId}, event)">
                            <div class="upload-icon">📤</div>
                            <div class="upload-text">Clique para fazer upload</div>
                        </label>`
                    }
                </div>
            </div>
        `;
    } else if (crianca.tipoTema === 'nova_arte') {
        container.innerHTML = `
            <div class="upload-area nova-arte">
                <div class="referencia-input">
                    <label class="upload-label">💡 Descrição ou referência (opcional)</label>
                    <textarea data-crianca="${criancaId}" data-campo="referenciaNovaArte" placeholder="Descreva como gostaria da arte ou conte mais sobre o tema...">${crianca.referenciaNovaArte}</textarea>
                </div>
                
                <label class="upload-label">📸 Imagem de referência (opcional)</label>
                <p class="upload-desc">Você pode enviar uma imagem para nos ajudar a criar a arte perfeita</p>
                <div id="uploadBox-${criancaId}">
                    ${crianca.imagemBase64 ? 
                        `<div class="image-preview">
                            <img src="${crianca.imagemBase64}" alt="Preview">
                            <button class="btn-remove-image" onclick="removerImagem(${criancaId})">✖</button>
                        </div>` :
                        `<label class="upload-box nova-arte">
                            <input type="file" accept="image/*" onchange="handleImageUpload(${criancaId}, event)">
                            <div class="upload-icon">🖼️</div>
                            <div class="upload-text">Clique para fazer upload (opcional)</div>
                        </label>`
                    }
                </div>
            </div>
        `;
        
        // Event listener para textarea
        const textarea = container.querySelector('textarea');
        if (textarea) {
            textarea.addEventListener('input', function() {
                atualizarCriancaCampo(criancaId, 'referenciaNovaArte', this.value);
            });
        }
    }
}

function handleImageUpload(criancaId, event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const crianca = criancas.find(c => c.id === criancaId);
        if (crianca) {
            crianca.imagemBase64 = e.target.result;
            renderizarUploadArea(criancaId);
            atualizarAvisoImagens();
        }
    };
    reader.readAsDataURL(file);
}

function removerImagem(criancaId) {
    const crianca = criancas.find(c => c.id === criancaId);
    if (crianca) {
        crianca.imagemBase64 = null;
        renderizarUploadArea(criancaId);
        atualizarAvisoImagens();
    }
}

function atualizarAvisoImagens() {
    const aviso = document.getElementById('avisoImagens');
    const temImagens = criancas.some(c => c.imagemBase64);
    
    if (temImagens) {
        aviso.classList.remove('hidden');
    } else {
        aviso.classList.add('hidden');
    }
}

// ============== PRODUTOS DA CRIANÇA ==============

function renderizarProdutosCrianca(criancaId) {
    const crianca = criancas.find(c => c.id === criancaId);
    if (!crianca) return;
    
    const container = document.getElementById(`produtosCrianca-${criancaId}`);
    container.innerHTML = '';
    
    crianca.produtos.forEach((produto, index) => {
        const div = document.createElement('div');
        div.className = 'produto-row';
        div.innerHTML = `
            <select class="produto-select" data-crianca="${criancaId}" data-index="${index}" data-campo="produtoId">
                <option value="">Selecione um produto</option>
                ${produtos.map(p => `
                    <option value="${p.id}" ${produto.produtoId == p.id ? 'selected' : ''}>
                        ${p.nome} - R$ ${p.preco.toFixed(2)}
                    </option>
                `).join('')}
            </select>
            <input type="number" min="1" value="${produto.quantidade}" 
                   data-crianca="${criancaId}" data-index="${index}" data-campo="quantidade" 
                   placeholder="Qtd">
            ${crianca.produtos.length > 1 ? 
                `<button onclick="removerProdutoCrianca(${criancaId}, ${index})">🗑️</button>` : 
                ''
            }
        `;
        container.appendChild(div);
    });
    
    // Event listeners
    container.querySelectorAll('select, input').forEach(el => {
        el.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            const campo = this.dataset.campo;
            const valor = campo === 'quantidade' ? parseInt(this.value) : this.value;
            
            crianca.produtos[index][campo] = valor;
            calcularTotal();
        });
    });
}

function adicionarProdutoCrianca(criancaId) {
    const crianca = criancas.find(c => c.id === criancaId);
    if (!crianca) return;
    
    crianca.produtos.push({ produtoId: '', quantidade: 1 });
    renderizarProdutosCrianca(criancaId);
}

function removerProdutoCrianca(criancaId, index) {
    const crianca = criancas.find(c => c.id === criancaId);
    if (!crianca) return;
    
    crianca.produtos.splice(index, 1);
    renderizarProdutosCrianca(criancaId);
    calcularTotal();
}

// ============== ENTREGA ==============

function inicializarOpcoesEntrega() {
    const container = document.getElementById('opcoesEntrega');
    
    OPCOES_ENTREGA.forEach(opcao => {
        const label = document.createElement('label');
        label.className = 'entrega-opcao';
        label.innerHTML = `
            <input type="radio" name="entrega" value="${opcao.id}">
            <span class="entrega-opcao-label">${opcao.label}</span>
            ${opcao.valor > 0 ? `<span class="entrega-opcao-valor">R$ ${opcao.valor.toFixed(2)}</span>` : ''}
        `;
        container.appendChild(label);
        
        const radio = label.querySelector('input');
        radio.addEventListener('change', function() {
            mostrarEndereco(this.value);
            calcularTotal();
        });
    });
}

function mostrarEndereco(tipoEntrega) {
    const container = document.getElementById('enderecoContainer');
    
    if (tipoEntrega && tipoEntrega !== 'retirada') {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
}

// ============== CÁLCULO TOTAL ==============

function calcularTotal() {
    let total = 0;
    let novasArtes = 0;
    
    criancas.forEach(crianca => {
        crianca.produtos.forEach(p => {
            const produto = produtos.find(prod => prod.id == p.produtoId);
            if (produto) {
                total += produto.preco * p.quantidade;
            }
        });
        
        if (crianca.tipoTema === 'nova_arte') {
            novasArtes++;
        }
    });
    
    total += novasArtes * TAXA_NOVA_ARTE;
    
    const entregaRadio = document.querySelector('input[name="entrega"]:checked');
    if (entregaRadio) {
        const opcaoEntrega = OPCOES_ENTREGA.find(e => e.id === entregaRadio.value);
        if (opcaoEntrega) {
            total += opcaoEntrega.valor;
        }
    }
    
    document.getElementById('totalValue').textContent = `R$ ${total.toFixed(2)}`;
}

// ============== ENVIAR WHATSAPP ==============

function enviarWhatsApp() {
    // Validações básicas
    const nomeResponsavel = document.getElementById('nomeResponsavel').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    
    if (!nomeResponsavel || !telefone) {
        alert('Por favor, preencha o nome do responsável e telefone!');
        return;
    }
    
    if (criancas.length === 0) {
        alert('Adicione pelo menos uma criança!');
        return;
    }
    
    // Validar dados das crianças
    for (let crianca of criancas) {
        if (!crianca.nomeCrianca || !crianca.tema || !crianca.tipoTema) {
            alert('Por favor, preencha todos os campos obrigatórios das crianças!');
            return;
        }
        
        if (crianca.tipoTema === 'catalogo' && !crianca.imagemBase64) {
            alert('Por favor, envie o print do tema do catálogo!');
            return;
        }
        
        if (crianca.produtos.some(p => !p.produtoId)) {
            alert('Por favor, selecione todos os produtos!');
            return;
        }
    }
    
    const entregaRadio = document.querySelector('input[name="entrega"]:checked');
    if (!entregaRadio) {
        alert('Por favor, selecione uma opção de entrega!');
        return;
    }
    
    // Validar endereço se necessário
    if (entregaRadio.value !== 'retirada') {
        const rua = document.getElementById('endRua').value.trim();
        const numero = document.getElementById('endNumero').value.trim();
        const bairro = document.getElementById('endBairro').value.trim();
        const cidade = document.getElementById('endCidade').value.trim();
        const cep = document.getElementById('endCep').value.trim();
        
        if (!rua || !numero || !bairro || !cidade || !cep) {
            alert('Por favor, preencha o endereço completo!');
            return;
        }
    }
    
    // Gerar mensagem
    const mensagem = gerarMensagemWhatsApp();
    const mensagemEncoded = encodeURIComponent(mensagem);
    
    // Abrir WhatsApp
    window.open(`https://wa.me/5581996156670?text=${mensagemEncoded}`, '_blank');
    
    // Avisar sobre imagens
    const temImagens = criancas.some(c => c.imagemBase64);
    if (temImagens) {
        setTimeout(() => {
            alert('📱 Importante: Após enviar a mensagem, por favor envie as imagens dos temas/referências que você anexou no formulário diretamente no chat do WhatsApp!');
        }, 1000);
    }
}

function gerarMensagemWhatsApp() {
    const nomeResponsavel = document.getElementById('nomeResponsavel').value;
    const telefone = document.getElementById('telefone').value;
    
    let mensagem = `*🎨 PEDIDO ETIQUETAS & TAL*\n\n`;
    mensagem += `*Responsável:* ${nomeResponsavel}\n`;
    mensagem += `*Telefone:* ${telefone}\n\n`;
    mensagem += `*═══════════════*\n`;
    
    let temImagens = false;
    
    criancas.forEach((crianca, index) => {
        mensagem += `\n*CRIANÇA ${index + 1}:*\n`;
        mensagem += `👤 Nome: ${crianca.nomeCrianca}\n`;
        if (crianca.nomeAbreviado) {
            mensagem += `📝 Nome Abreviado: ${crianca.nomeAbreviado}\n`;
        }
        mensagem += `🎨 Tema: ${crianca.tema}\n`;
        
        if (crianca.tipoTema === 'catalogo') {
            mensagem += `📋 Tipo: Tema do Catálogo\n`;
            if (crianca.imagemBase64) {
                mensagem += `📎 *Imagem anexada no print*\n`;
                temImagens = true;
            }
        } else if (crianca.tipoTema === 'nova_arte') {
            mensagem += `✨ Tipo: Nova Arte (+R$ ${TAXA_NOVA_ARTE.toFixed(2)})\n`;
            if (crianca.referenciaNovaArte) {
                mensagem += `💡 Referência: ${crianca.referenciaNovaArte}\n`;
            }
            if (crianca.imagemBase64) {
                mensagem += `📎 *Imagem de referência anexada no print*\n`;
                temImagens = true;
            }
        }
        
        if (crianca.escola || crianca.serie || crianca.turma) {
            mensagem += `📚 Info Adicionais:\n`;
            if (crianca.escola) mensagem += `   - Escola: ${crianca.escola}\n`;
            if (crianca.serie) mensagem += `   - Série: ${crianca.serie}\n`;
            if (crianca.turma) mensagem += `   - Turma: ${crianca.turma}\n`;
        }
        
        mensagem += `\n*Produtos:*\n`;
        crianca.produtos.forEach(p => {
            const produto = produtos.find(prod => prod.id == p.produtoId);
            if (produto) {
                mensagem += `• ${produto.nome} - Qtd: ${p.quantidade} - R$ ${(produto.preco * p.quantidade).toFixed(2)}\n`;
            }
        });
        
        mensagem += `\n*═══════════════*\n`;
    });
    
    const entregaRadio = document.querySelector('input[name="entrega"]:checked');
    const opcaoEntrega = OPCOES_ENTREGA.find(e => e.id === entregaRadio.value);
    
    mensagem += `\n*🚚 ENTREGA:*\n`;
    mensagem += `${opcaoEntrega.label}`;
    if (opcaoEntrega.valor > 0) {
        mensagem += ` - R$ ${opcaoEntrega.valor.toFixed(2)}`;
    }
    mensagem += `\n`;
    
    if (entregaRadio.value !== 'retirada') {
        const rua = document.getElementById('endRua').value;
        const numero = document.getElementById('endNumero').value;
        const complemento = document.getElementById('endComplemento').value;
        const bairro = document.getElementById('endBairro').value;
        const cidade = document.getElementById('endCidade').value;
        const cep = document.getElementById('endCep').value;
        
        mensagem += `\n*📍 Endereço:*\n`;
        mensagem += `${rua}, ${numero}`;
        if (complemento) mensagem += ` - ${complemento}`;
        mensagem += `\n${bairro} - ${cidade}\n`;
        mensagem += `CEP: ${cep}\n`;
    }
    
    const total = document.getElementById('totalValue').textContent;
    mensagem += `\n*💰 TOTAL: ${total}*`;
    
    if (temImagens) {
        mensagem += `\n\n⚠️ *ATENÇÃO: Vou enviar as imagens dos temas/referências logo em seguida!*`;
    }
    
    return mensagem;
}

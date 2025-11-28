// src/scripts/carrinho.js

// Estrutura de dados para os ingressos disponíveis
const INGRESSOS = [
    {
        id: 'individual',
        nome: 'Ingresso Individual',
        descricao: 'Para visitantes acima de 12 anos',
        preco: 50.00
    },
    {
        id: 'infantil',
        nome: 'Ingresso Infantil',
        descricao: 'Crianças de 3 a 12 anos',
        preco: 25.00
    },
    {
        id: 'familia',
        nome: 'Ingresso Família',
        descricao: '2 adultos + 2 crianças',
        preco: 130.00
    }
];

// Função para obter o carrinho do LocalStorage
function getCarrinho() {
    const carrinhoJSON = localStorage.getItem('carrinhoZooCentral');
    return carrinhoJSON ? JSON.parse(carrinhoJSON) : [];
}

// Função para salvar o carrinho no LocalStorage
function saveCarrinho(carrinho) {
    localStorage.setItem('carrinhoZooCentral', JSON.stringify(carrinho));
}

// Função para adicionar um item ao carrinho
function adicionarAoCarrinho(ingressoId) {
    const carrinho = getCarrinho();
    const ingresso = INGRESSOS.find(i => i.id === ingressoId);

    if (!ingresso) {
        console.error('Ingresso não encontrado:', ingressoId);
        return;
    }

    const itemExistente = carrinho.find(item => item.id === ingressoId);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: ingresso.id,
            nome: ingresso.nome,
            preco: ingresso.preco,
            quantidade: 1
        });
    }

    saveCarrinho(carrinho);
    alert(`${ingresso.nome} adicionado ao carrinho!`);
    updateCarrinhoCount();
}

// Função para remover um item do carrinho
function removerDoCarrinho(ingressoId) {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(item => item.id !== ingressoId);
    saveCarrinho(carrinho);
    renderCarrinho();
    updateCarrinhoCount();
}

// Função para atualizar a quantidade de um item
function atualizarQuantidade(ingressoId, novaQuantidade) {
    let carrinho = getCarrinho();
    const item = carrinho.find(item => item.id === ingressoId);

    if (item) {
        item.quantidade = parseInt(novaQuantidade);
        if (item.quantidade <= 0) {
            removerDoCarrinho(ingressoId);
            return;
        }
    }

    saveCarrinho(carrinho);
    renderCarrinho();
    updateCarrinhoCount();
}

// Função para formatar o preço
function formatarPreco(preco) {
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para renderizar o carrinho na página Carrinho.html
function renderCarrinho() {
    const carrinho = getCarrinho();
    const containerItens = document.getElementById('carrinho-itens');
    const carrinhoVazio = document.getElementById('carrinho-vazio');
    let subtotal = 0;

    // Limpa o container
    containerItens.innerHTML = '';

    if (carrinho.length === 0) {
        carrinhoVazio.style.display = 'block';
        containerItens.appendChild(carrinhoVazio);
    } else {
        carrinhoVazio.style.display = 'none';
        
        carrinho.forEach(item => {
            const totalItem = item.preco * item.quantidade;
            subtotal += totalItem;

            const itemHTML = `
                <div class="item-carrinho">
                    <div class="item-info">
                        <h4>${item.nome}</h4>
                        <p>${item.descricao || ''}</p>
                    </div>
                    <div class="item-quantidade">
                        <button onclick="atualizarQuantidade('${item.id}', ${item.quantidade - 1})">-</button>
                        <input type="number" value="${item.quantidade}" min="1" 
                               onchange="atualizarQuantidade('${item.id}', this.value)">
                        <button onclick="atualizarQuantidade('${item.id}', ${item.quantidade + 1})">+</button>
                    </div>
                    <div class="item-preco">${formatarPreco(totalItem)}</div>
                    <button class="remover-item" onclick="removerDoCarrinho('${item.id}')">
                        &times;
                    </button>
                </div>
            `;
            containerItens.innerHTML += itemHTML;
        });
    }

    // Atualiza o resumo
    const total = subtotal; // Sem desconto por enquanto
    document.getElementById('subtotal').textContent = formatarPreco(subtotal);
    document.getElementById('desconto').textContent = formatarPreco(0);
    document.getElementById('total').textContent = formatarPreco(total);
}

// Função para atualizar o contador de itens no carrinho (se houver)
function updateCarrinhoCount() {
    const carrinho = getCarrinho();
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    const carrinhoLink = document.querySelector('a[href="Carrinho.html"]');

    if (carrinhoLink) {
        // Remove o contador antigo se existir
        let countSpan = carrinhoLink.querySelector('.carrinho-count');
        if (countSpan) {
            carrinhoLink.removeChild(countSpan);
        }

        if (totalItens > 0) {
            countSpan = document.createElement('span');
            countSpan.className = 'carrinho-count';
            countSpan.textContent = totalItens;
            carrinhoLink.appendChild(countSpan);
        }
    }
}

// Adiciona um listener para carregar o carrinho ao carregar a página
if (window.location.pathname.includes('Carrinho.html')) {
    document.addEventListener('DOMContentLoaded', renderCarrinho);
}

// Adiciona um listener para atualizar o contador em todas as páginas
document.addEventListener('DOMContentLoaded', updateCarrinhoCount);
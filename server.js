// Selecione o ícone de atualização
const atualizarPaginaIcone = document.querySelector('#atualizarPagina span i');

// Adicione um evento de clique ao ícone de atualização
atualizarPaginaIcone.addEventListener('click', () => {
    console.log(atualizarPaginaIcone);
    // Recarregue a página
    location.reload();
});




// Função para fazer uma solicitação HTTP GET para a sua API e preencher a tabela
function carregarDados() {
    fetch('http://localhost:8080/api/lista_preCadastros')
    .then(response => response.json())
    .then(data => {
        // Seleciona o corpo da tabela
        const tbody = document.querySelector('#dadosPreCadastro tbody');

        // Limpa o conteúdo anterior da tabela
        tbody.innerHTML = '';

        if (data.length === 0) {
            // Se a lista estiver vazia, adicione uma frase fixa à página
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="9">Nenhum pré-cadastro disponível.</td>`;
            tbody.appendChild(emptyRow);
        } else {
            // Se a lista não estiver vazia, itere sobre os dados e adicione as linhas à tabela
            data.forEach(preCadastro => {
                const newRow = document.createElement('tr');
                
                newRow.innerHTML = `
                    <td>${preCadastro.nome}</td>
                    <td>${preCadastro.rua}</td>
                    <td>${preCadastro.bairro}</td>
                    <td>${preCadastro.numero}</td>
                    <td>${preCadastro.telefone}</td>
                    <td>${preCadastro.planoResidencial}</td>
                    <td>${preCadastro.planoComercial}</td>
                    <td>${preCadastro.email}</td>
                    <td>
                        <input type="number" class="valor-input">
                        <button class="enviar-btn" data-preCadastro-id="${preCadastro.idPreCadastro}">Enviar</button>
                    </td>
                `;
                
                tbody.appendChild(newRow);
            });
        }
        // Adiciona um event listener para todos os botões de envio
        const enviarBtns = document.querySelectorAll('.enviar-btn');
        enviarBtns.forEach(enviarBtn => {
            enviarBtn.addEventListener('click', () => {
                // Obtém o ID do pré-cadastro diretamente do botão de envio
                const idInput = enviarBtn.getAttribute('data-preCadastro-id');
                console.log("ID do pré-cadastro:", idInput);
                const valorInput = enviarBtn.previousElementSibling.value;

                // Objeto com o valor a ser atualizado na outra tabela
                const dadosAtualizados = {
                    valor: valorInput,
                    // Você não precisa incluir os outros dados aqui, pois eles não serão atualizados
                };

                // Envia a requisição PUT para atualizar o valor na outra tabela
                fetch(`http://localhost:8080/api/atualizar/${idInput}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosAtualizados),
                })
                .then(response => {
                    if (response.ok) {
                        new Notification('Sucesso', {
                            body: 'Pré-cadastro atualizado para Cadastro Definitivo com sucesso.'
                        });
                        location.reload();
                        // Você pode adicionar lógica adicional aqui, como atualizar a página
                    } else {
                        throw new Error('Falha ao atualizar o valor.');
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    // Trate o erro de acordo com suas necessidades
                });
            });
        });
        
    })
    .catch(error => {
        console.error('Erro ao carregar os dados:', error);
    });
}

// Chama a função para carregar os dados quando a página for carregada
window.onload = carregarDados;

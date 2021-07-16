// config.js - script que irá conter as funções e variáveis relacionadas as configurações do campo (Linha, Coluna e Número de Bombas...).

var lines = 8; // Número de Linhas.
var columns = 10; // Número de Colunas.
var numBombs = 10; // Número de Bombas.
var playing = false; // Estado de jogo, iniciado ou não.
var finished = false; // Estado de conclusão, finalizado ou não.

// Define o máximo de bombas com base nas linhas e colunas, um campo minado precisa ter pelo menos uma posição livre.
function updateMaxBombs(maxLines, maxColumns) {
    $('#bombs').attr('max', maxLines * maxColumns);
}

// Antes que a tecla seja solta no input é realizado um procedimento para verificar o dígito.
$('#lines').keydown(event => {
    let input = $(event.target); 
    let value = parseInt(event.key); // Tecla digitada.
    let inputValue = Math.abs(input.val()); // Valor anterior armazenado no input.
    let min = parseInt(input.attr('min')); // Valor mínimo atribuído ao input.

    // Se for um hífen o evento é cancelado.
    if(event.which == 189) {
        event.preventDefault();
    }

    // Se for um número inteiro:
    if(Number.isInteger(value)) {
        let totalValue = parseInt(`${inputValue}${value}`); // Total: valor anterior concatenado ao dígito inserido.

        // Verifica se está no intervalo ideal:
        if(totalValue < min) {
            event.preventDefault(); // Caso não esteja, o evento é cancelado.
        } else {
            lines = totalValue; // Atualiza a configuração de linhas.
            updateMaxBombs(lines, columns); // Atualiza o máximo de bombas permitido.
        }
    }
});

// Antes que a tecla seja solta no input é realizado um procedimento para verificar o dígito.
$('#columns').keydown(event => {
    let input = $(event.target);
    let value = parseInt(event.key); // Tecla digitada.
    let inputValue = Math.abs(input.val()); // Valor anterior armazenado no input.
    let min = parseInt(input.attr('min')); // Valor mínimo atribuído ao input.

    // Se for um hífen o evento é cancelado.
    if(event.which == 189) {
        event.preventDefault();
    }

    // Se for um número inteiro:
    if(Number.isInteger(value)) {
        let totalValue = parseInt(`${inputValue}${value}`);  // Total: valor anterior concatenado ao dígito inserido.

        // Verifica se está no intervalo ideal:
        if(totalValue < min) {
            event.preventDefault(); // Caso não esteja, o evento é cancelado.
        } else {
            columns = totalValue; // Atualiza a configuração de colunas.
            updateMaxBombs(lines, columns); // Atualiza o máximo de bombas permitido.
        }
    }
});

// Antes que a tecla seja solta no input é realizado um procedimento para verificar o dígito.
$('#bombs').keydown(event => {
    let input = $(event.target);
    let value = parseInt(event.key); // Tecla digitada.
    let inputValue = Math.abs(input.val()); // Valor anterior armazenado no input.
    let min = parseInt(input.attr('min')); // Valor mínimo atribuído ao input.
    let max = parseInt(input.attr('max')); // Valor máximo atribuído ao input.

    // Se for um hífen o evento é cancelado.
    if(event.which == 189) {
        event.preventDefault();
    }

    // Se for um número inteiro:
    if(Number.isInteger(value)) {
        let totalValue = parseInt(`${inputValue}${value}`); // Total: valor anterior concatenado ao dígito inserido.

        // Verifica se está no intervalo ideal:
        if(totalValue < min || totalValue >= max) {
            event.preventDefault(); // Caso não esteja, o evento é cancelado.
        } else {
            numBombs = totalValue; // Atualiza a quantidade de bombas.
        }
    }
});
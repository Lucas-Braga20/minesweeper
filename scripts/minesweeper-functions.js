// minesweeper-functions.js - script que irá conter as funções relacionadas ao campo minado.

var minesweeper;
var bombs;

function createMatrix(lines, columns) {
    let matrix = new Array();

    for(let i = 0; i < lines; i++) {
        // Cria colunas com string vazia.
        matrix.push(new Array(columns).fill(''));
    }

    return matrix;
}

function generateBombs(minesweeper, numBombs, maxLines, maxColumns) {
    // Cria a lista de posições com uma bomba.
    var listPositions = new Array({
        x: getRandomInt(0, maxLines), 
        y: getRandomInt(0, maxColumns)
    });
    minesweeper[listPositions[0].x][listPositions[0].y] = -1;

    // Como a lista de posições já foi criada com uma bomba, a estrutura de repetição percorre a quantidade bombas menos uma posição.
    for(let i = 0; i < numBombs - 1; i++) {
        let indicator = false;
        let position;

        do {
            position = {
                x: getRandomInt(0, maxLines),
                y: getRandomInt(0, maxColumns),
            };

            // O campo minado não pode conter bombas repetidas.
            // Portanto, a geração de bombas é realizada até que nenhuma repetição seja identificada.
            // As repetições são representadas pela variável 'indicator', caso haja repetição ela será true, caso contrário false.
            // 'Indicator' controla o do-while.
            for(let j = 0; j < listPositions.length; j++) {
                if(position.x == listPositions[j].x && position.y == listPositions[j].y) {
                    indicator = true;
                    break;
                } else {
                    indicator = false;
                }
            }
        } while(indicator == true);

        listPositions.push(position);
        minesweeper[position.x][position.y] = -1;
    }

    return listPositions;
}

// Conta a quantidade de bombas ao redor de uma posição.
function countBombAroundPosition(minefield, x, y, maxLines, maxColumns) {
    let numBombs = 0; 

    // As posições adjacentes a uma casa ficam dentro de uma área 3x3.
    // Horizontal: X 
    // Vertical: Y
    // [x-1/y-1]   [x-1/y-0]   [x-1/y+1]
    // [x-0/y-1]   [posição]   [x-0/y+1]
    // [x+1/y-1]   [x+1/y-0]   [x+1/y+1]

    // Exemplo: X = 2, Y = 3
    // [  1/2  ]   [  1/3  ]   [  1/4  ]
    // [  2/2  ]   [posição]   [  2/4  ]
    // [  3/2  ]   [  3/3  ]   [  3/4  ]

    for(let i = 0; i < 3; i++) {
        let line = x - 1 + i;
        // Exemplo: X = 2, Y = 3
        // Linhas:
        // 1°. Ciclo: 2 - 1 + 0 = 1;
        // 2°. Ciclo: 2 - 1 + 1 = 2;
        // 3°. Ciclo: 2 - 1 + 2 = 3;

        for(let j = 0; j < 3; j++) {
            let column = y - 1 + j;
            // Exemplo: X = 2, Y = 3
            // Colunas:
            // 1°. Ciclo: 3 - 1 + 0 = 2;
            // 2°. Ciclo: 3 - 1 + 1 = 3;
            // 3°. Ciclo: 3 - 1 + 2 = 4;

            // Caso o X e Y sejam 0, haverá um problema com as posições anteriores em que X será -1 e Y será -1.
            // Caso o X e Y estejam em seu máximo de linhas e colunas, haverá outro problema com as posições posteriores em que X será >= maxLines e Y será >= maxColumns.
            // Para evitar isso foi utilizado uma estrutura condicional.
            if(line >= 0 && line < maxLines && column >= 0 && column < maxColumns) {
                // As bombas são representadas por -1.
                if(minefield[line][column] == -1) {
                    numBombs++;
                }
            }
        }
    }

    return numBombs;
}

// Função para processar a vitória do jogador.
function won() {
    playing = false; // "playing" passa a ser falso.
    finished = true; // "finished" passa a ser true.
    timerStop(); // O cronômetro é parado.

    window.alert('Você Ganhou!');
}

// Função para processar a derrota do jogador.
function defeat(listBombs) {
    playing = false; // "playing" passa a ser falso.
    finished = true; // "finished" passa a ser true.
    timerStop(); // O cronômetro é parado.
    
    // Revela todas as bombas do campo.
    for(let i = 0; i < listBombs.length; i++) {
        $(`.line-${listBombs[i].x} .column-${listBombs[i].y}`).removeClass('invisible').removeClass('flag').addClass('visible').html('<i class="fas fa-bomb"></i>');
    }

    window.alert('Você perdeu!');
}

// Função para processar a desistência do jogador.
function giveUp(minesweeper, maxLines, maxColumns) {
    // Revela todas as áreas.
    for(let i = 0; i < maxLines; i++) {
        for(let j = 0; j < maxColumns; j++) {
            // Áreas nulas.
            if(minesweeper[i][j] == 0) {
                $(`.line-${i} .column-${j}`).removeClass('invisible').removeClass('flag').addClass('visible');
            }
            // Áreas com dicas.
            if(minesweeper[i][j] != 0 && minesweeper[i][j] != -1) {
                $(`.line-${i} .column-${j}`).removeClass('invisible').removeClass('flag').addClass('visible').addClass(`number-${minesweeper[i][j]}`).html(minesweeper[i][j]);
            }
            // Áreas com bombas.
            if(minesweeper[i][j] == -1) {
                $(`.line-${i} .column-${j}`).removeClass('invisible').removeClass('flag').addClass('visible').html('<i class="fas fa-bomb"></i>');
            }
        }
    }
}

// Função para controlar o clique em uma posição.
function pressPosition(line, column) {
    // Quando o jogador não estiver jogando e a partida não estiver concluída:
    if(playing == false && finished == false) {
        playing = true; // Inicia o jogo.
        timerStart(); // Inicia o cronômetro.
    }

    // Quando o usuário estiver jogando:
    if(playing == true) {
        // Clique em bombas.
        if(minesweeper[line][column] == -1) {
            defeat(bombs);
        } else {
            cleanCells(minesweeper, line, column, lines, columns);
        }

        // Verifica se todas as casas que não são bombas foram reveladas.
        if($('.visible').length == (lines * columns - numBombs)) {
            won();
        }
    }
}

// Função para controlar a alocação de bandeiras com o botão direito.
function putFlag(line, column) {
    let position = $(`.line-${line} .column-${column}`); // Posição do evento.

    // Verifica se essa posição não está revelada.
    if(position.hasClass('invisible')) {
        // Caso já conter a bandeira ela deve ser removida.
        if(position.hasClass('flag')) {
            position.removeClass('flag').html('');
        }
        // Caso não possuir bandeira, ela deve ser colocada. 
        else {
            position.addClass('flag').html('<i class="fas fa-flag"></i>');
        }
    }
}

// Atualiza a tabela do campo minado.
function createTable(minesweeper, maxLines, maxColumns) {
    $('.table-body').html('');

    for(let i = 0; i < minesweeper.length; i++) {
        $('.table-body').append(`<tr class="line line-${i}"></tr>`);

        for(let j = 0; j < minesweeper[i].length; j++) {
            $(`.line-${i}`).append(`<td onclick="pressPosition(${i}, ${j})" oncontextmenu="putFlag(${i}, ${j})" class="column column-${j} invisible"></td>`);

            // Verifica se não é bomba.
            // Caso não for, pode ser campo nulo ' ' ou campo adjascente a bomba.
            if(minesweeper[i][j] != -1) {
                var amount = countBombAroundPosition(minesweeper, i, j, maxLines, maxColumns);
                minesweeper[i][j] = amount;
            }
        }
    }
}

// Função recursiva que revela as posições seguras ao redor de uma posição passada por parâmetro (x e y).
function cleanCells(minesweeper, x, y, maxLines, maxColumns) {
    let center = minesweeper[x][y];

    // Se na chamada da função, o centro for um dica, apenas é revelada área.
    if(center != -1 && center != 0) {
        $(`.line-${x} .column-${y}`).removeClass('invisible').removeClass('flag').addClass('visible').addClass(`number-${center}`).html(center);
    }
    // Se não for dica nem bomba, será um espaço nulo.
    else if(center != -1) {
        // Uma posição nula é centro de uma área segura 3x3.
        // As estruturas de repetições aninhadas serão responsáveis por percorrer um área 3x3 com x e y ao centro.
        // Horizontal: X / Vertical: Y
        // [x-1/y-1]   [x-1/y-0]   [x-1/y+1]
        // [x-0/y-1]   [posição]   [x-0/y+1]
        // [x+1/y-1]   [x+1/y-0]   [x+1/y+1]
        for(let i = 0; i < 3; i++) {
            let line = x - 1 + i;

            for(let j = 0; j < 3; j++) {
                let column = y - 1 + j;

                // Evita que o programa acesse posições inexistentes, com índices negativos ou maiores que o limite.
                if(line >= 0 && line < maxLines && column >= 0 && column < maxColumns) {
                    let position = $(`.line-${line} .column-${column}`);

                    // Se a posição estiver invisível, será executado um processo.
                    // Caso contrário, retorna para a verificação das outras posições dentro do 3x3.
                    if(position.hasClass('invisible')) {

                        if(minesweeper[line][column] == 0) {
                            position.removeClass('invisible').removeClass('flag').addClass('visible').html(' '); // Revela a posição.

                            // Por se tratar de uma casa nula, dentro da sua área 3x3 nunca haverá uma bomba, por isso é chamado novamente a função.
                            cleanCells(minesweeper, line, column, maxLines, maxColumns);
                        }
                        else if(minesweeper[line][column] != -1) {
                            position.removeClass('invisible').removeClass('flag').addClass('visible').addClass(`number-${minesweeper[line][column]}`).html(minesweeper[line][column]); // Revela a posição da dica.
                        }
                    }
                }
            }
        }
    }
}

// Recria um campo minado.
function restart() {
    minesweeper = createMatrix(lines, columns); // Cria o campo.
    bombs = generateBombs(minesweeper, numBombs, lines, columns); // Gera as bombas.
    createTable(minesweeper, lines, columns); // Cria a tabela html.
}

// Evita que o botão direito abra o "contextmenu".
$(document).on('contextmenu', (event) => event.preventDefault());

// Cria o campo minado.
$('#btn-play').click(event => {
    $(event.target).text('Reiniciar'); // Atualiza o texto do botão.
    $('#btn-give-up').removeAttr('disabled'); // Habilita o botão Desistir.

    finished = false; // Inicia um novo jogo.

    restart(); // Recria o campo minado.

    timerStop(); // Para o cronômetro, caso o usuário clique em reiniciar durante um jogo pendente.
    timerReset(); // Reseta o cronômetro.
});

// Desiste do jogo.
$('#btn-give-up').click(() => {
    playing = false; // Retira a condição de "jogando".
    finished = true; // Conclui a partida.

    $('#btn-give-up').attr('disabled', 'disabled'); // Desabilita o botão Desistir.

    giveUp(minesweeper, lines, columns); // Executa a função que irá revelar as posições.

    timerStop(); // Para o cronômetro.
});
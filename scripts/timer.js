// timer.js - scipt que irá conter todas as funções que controlam o cronômetro.

var timer; // Cronômetro.
var initialTime; // Tempo Inicial.

// Inicia o loop do cronômetro. 
function timerStart() {
    initialTime = moment();

    timer = setInterval(() => {
        $('#timer').text(getTime());
    }, 1000);
}

// Finaliza o loop do cronômetro.
function timerStop() {
    clearInterval(timer);
}

// Reseta o cronômetro.
function timerReset() {
    $('#timer').text('00:00:00');
}

// Atualiza o tempo.
function getTime() {
    return moment.utc(moment().diff(initialTime)).format("HH:mm:ss");
}
// basic-function.js - script que irá conter as funções básicas

// Retorna um número inteiro randômico dentro do intervalo especificado por parâmetro [min, max[
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min;
}
const wHeight = $(window).height();
const wWidth = $(window).width();
let player = {};
let orbs = [];
let players = [];

const canvas = document.querySelector('#the-canvas');
const context = canvas.getContext('2d');
canvas.height = wHeight;
canvas.width = wWidth;

$(window).load(() => {
    $('#loginModal').modal('show');
});

$('.name-form').submit(evt => {
    evt.preventDefault();
    player.name = document.querySelector('#name-input').value;
    $('#loginModal').modal('hide');
    $('#spawnModal').modal('show');
    document.querySelector('.player-name').innerText = player.name;
});

$('.start-game').click(evt => {
    $('#spawnModal').modal('hide');
    $('.hiddenOnStart').removeAttr('hidden');
    init();
});
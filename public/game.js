var socket = io();

var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');

var player = {id:0, x:0, y:0}
var otherPlayers={};
var KEYBOARD = {"KEY_LEFT": 37, "KEY_UP": 38, "KEY_RIGHT": 39, "KEY_DOWN": 40};
var keydown = [];

//make canvas full screen
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// keyboard event listeners
window.addEventListener("keydown", function (e){
    switch(e.keyCode){
        case 37: player.x-=10; break;
        case 38: player.y-=10; break;
        case 39: player.x+=10; break;
        case 40: player.y+=10; break;
        default:
    }

    socket.emit('updatePlayer', player);
});

socket.on('identify', function (data) {
    player.id=data.id;
    otherPlayers=data.others;
    document.querySelector('h3').innerHTML="You are player " + player.id + ". Press arrow keys to move";
    placePlayer();
});

socket.on('addPlayer', function (data) {
    otherPlayers[data.id]=data;
});

socket.on('removePlayer', function (data) {
    var keys = Object.keys(otherPlayers);
    for(var i = 0; i < keys.length; i++)
    {
        if(keys[i]==data){
            delete otherPlayers[keys[i]];
        }
    }
});

socket.on('updatePlayer', function (data) {
    otherPlayers[data.id]=data;
});

function draw()
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.font="bold 14px Arial";

    //draw player
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y, 20, 20);

    //draw other players
    ctx.fillStyle='blue';

    var keys = Object.keys(otherPlayers);
    if(keys.length>0){
        for(var i = 0; i < keys.length; i++)
        {
            var cur = otherPlayers[keys[i]];
            ctx.fillRect(cur.x, cur.y, 20, 20);
        }
    }
    window.requestAnimationFrame(draw);
}

function placePlayer(){
    player.y=canvas.height*Math.random();
    socket.emit('addPlayer', player);
    draw();
}
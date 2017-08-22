$(document).ready(() => {
    let messages = [];
    let socket = io.connect('http://localhost:3000');
    let chatForm = $("#chatForm");
    let message = $("#chatInput");
    let chatWindow = $("#chatWindow");
    let userForm = $("#userForm");
    let userName = $("#userName");
    let users = $("#users");
    let error = $("#error");

    userForm.on('submit', function(e){
        socket.emit('set user', userName.val(), function(data){
            console.log(data);
            if(data){
                $("#userFormWrap").hide();
                $("#mainWrap").show();
            } else{
                error.html('Username is taken');
            }
        });
        e.preventDefault();
    });

    chatForm.on('submit', function(e){
        e.preventDefault();
        socket.emit('send message', message.val());
        message.val('');        
    });

    socket.on('show message', function(data){
        console.log(data);
        chatWindow.append('<strong>'+data.user+'</strong>: '+data.msg+'<br>')
    });

    socket.on('users', function(data){
        let html = '';
        for(i=0; i<data.length;i++){
            html += '<li class="list-group-item">'+data[i]+'</li>'
        }
        users.html(html);
    });
});
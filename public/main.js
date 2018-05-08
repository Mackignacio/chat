//Socket connection
let socket, port = 'http://localhost:3333';
//socket = io.connect('http://localhost:3333');
// Query DOM
let message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn_send = document.getElementById('send'),
    btn_connect = document.getElementById('connect'),
    output = document.getElementById('output'),
    dropdown = document.getElementById('sendto'),
    feedback = document.getElementById('feedback');

//emit events

btn_send.addEventListener('click', () => {
    let sendtoId = dropdown.options[dropdown.selectedIndex].value;
    let sendtoMessage = dropdown.options[dropdown.selectedIndex].text;
    console.log(sendtoId, sendtoMessage);
    socket.emit('chat', {
        message: message.value,
        handle: handle.value,
        id: sendtoId,
        reciver: sendtoMessage
    });
    if (sendtoId != 'all') {
        output.innerHTML += `<p><strong> ${handle.value} : </strong> ${message.value} </p>`;
    }
    message.value = "";
});

btn_connect.addEventListener('click', () => {
    if (handle.value) {
        socket = io.connect(port);
        socket.emit('connected', handle.value);
        socketEventListener();
        handle.disabled = true;
        btn_connect.hidden = true;
    } else {
        alert("Handle name is required!!!");
    }
});

message.addEventListener('keypress', () => {
    let data;
    let sendtoId = dropdown.options[dropdown.selectedIndex].value;
    if (sendtoId == 'all') {
        data = handle.value;
    } else {
        data = {
            handle: handle.value,
            id: sendtoId
        }
    }
    socket.emit('typing', data)
});

//Listen for event
function socketEventListener() {
    socket.on('chat', data => {
        console.log(data);
        feedback.innerHTML = "";
        output.innerHTML += `<p><strong> ${data.handle} : </strong> ${data.message} </p>`;
    });

    socket.on('typing', data => {
        feedback.innerHTML = `<p><em> ${data.handle == undefined ? data : data.handle} is typing a message... </em></p>`;
        setTimeout(() => {
            feedback.innerHTML = "";
        }, 5000);
    });

    socket.on('list', data => {
        //console.log(data);
        dropdown.innerHTML = "";
        for (const key of Object.keys(data)) {

            if (data[key].name != handle.value) {//console.log(data[key].name," : ",data[key].id);
                dropdown.innerHTML += `<option value = "${data[key].id}">${data[key].name}</option>`;
            }
        }

    });
}



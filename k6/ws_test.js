import ws from 'k6/ws';
import { check, sleep } from 'k6';

export const options = {
    vus: 100,
    duration: '30s',
};

const userIds = [...Array(100)].map((_, i) => `user${i}`);

export default function () {
    const sender = __VU - 1; // VU는 1부터 시작
    const senderId = userIds[sender];
    const receiverId = userIds[(sender + 1) % userIds.length]; // 다음 유저에게 전송

    const url = `ws://localhost:8080/ws?senderId=${senderId}`;

    const res = ws.connect(url, function (socket) {
        socket.on('open', function () {
            console.log(`🔗 [${senderId}] connected`);

            const message = {
                type: 'offer',
                sender: senderId,
                receiver: receiverId,
                content: `message from ${senderId} to ${receiverId}`,
            };

            socket.send(JSON.stringify(message));
        });

        socket.on('message', function (data) {
            console.log(`📩 [${senderId}] received: ${data}`);
        });

        socket.on('close', function () {
            console.log(`❌ [${senderId}] disconnected`);
        });

        socket.setTimeout(function () {
            socket.close();
        }, 1000);
    });

    check(res, {
        'status is 101': (r) => r && r.status === 101,
        'Connected successfully': (r) => r && r.status === 101,
    });

    sleep(1);
}
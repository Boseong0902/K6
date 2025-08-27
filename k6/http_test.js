import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 100,
    duration: '30s',
};

const userIds = [...Array(100)].map((_, i) => `user${i}`);

export default function () {
    const senderIndex = __VU - 1;
    const senderId = userIds[senderIndex];
    const receiverId = userIds[(senderIndex + 1) % userIds.length];

    const headers = { 'Content-Type': 'application/json' };

    // 1. POST: 메시지 전송
    const payload = JSON.stringify({
        type: 'offer',
        sender: senderId,
        receiver: receiverId,
        content: `message from ${senderId} to ${receiverId}`,
    });

    const postRes = http.post('http://localhost:8080/signal/send', payload, { headers });

    check(postRes, {
        'POST /signal/send status is 200': (res) => res.status === 200,
        'POST succeeded': (res) => res.body && res.body.includes('received'),
    });

    sleep(1);

    // 2. GET: 메시지 수신
    const getRes = http.get(`http://localhost:8080/signal/receive?receiver=${receiverId}`);

    check(getRes, {
        'GET /signal/receive status is 200': (res) => res.status === 200,
    });

    console.log(`📨 [${senderId}] sent to [${receiverId}] / Received: ${getRes.body}`);

    sleep(1);
}
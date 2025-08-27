import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 10,               // 동시에 요청할 가상 사용자 수
    duration: '30s',       // 테스트 실행 시간
};

export default function () {
    // 1. POST 요청으로 메시지 전송
    const payload = JSON.stringify({
        type: 'offer',
        sender: `user-${__VU}`,      // 가상 사용자 ID별 고유 이름
        receiver: `user-${(__VU % 5) + 1}`, // 수신자는 1~5번 사용자 중 하나
        content: 'This is a signaling message for testing.'
    });

    const headers = { 'Content-Type': 'application/json' };

    const postRes = http.post('http://localhost:8080/signal/send', payload, { headers });

    check(postRes, {
        'POST /signal/send status is 200': (res) => res.status === 200,
        'Message stored': (res) => res.body.includes('received'),
    });

    sleep(1);

    // 2. GET 요청으로 메시지 수신 (수신자 역할 수행)
    const receiver = `user-${(__VU % 5) + 1}`;
    const getRes = http.get(`http://localhost:8080/signal/receive?receiver=${receiver}`);

    check(getRes, {
        'GET /signal/receive status is 200': (res) => res.status === 200,
    });

    sleep(1);
}
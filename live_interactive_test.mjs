// Live Interactive Test Script for Vercel deployment: https://hcm-minigame.vercel.app/
// Automatically detects when the User opens room HCM1945 on Vercel, joins students,
// tests leave, progress, and kicks on ROOM_CLOSED.

import mqtt from 'mqtt';

const BROKER = 'wss://iot.coreflux.cloud:443/mqtt';
const ROOM_CODE = process.argv[2] || 'HCM1945';

console.log('\n===============================================================');
console.log('🌐 LIVE BOT TESTER CHO PHIÊN BẢN VERCEL: https://hcm-minigame.vercel.app/');
console.log(`📡 Broker: ${BROKER} | Đang chờ Host mở phòng: ${ROOM_CODE}`);
console.log('===============================================================\n');

const STUDENTS = [
  { name: 'Nguyễn Văn An (K45)', id: 'p_live_an' },
  { name: 'Trần Thị Bình (K46)', id: 'p_live_binh' },
  { name: 'Lê Hoàng Cường (K45)', id: 'p_live_cuong' },
  { name: 'Phạm Minh Đức (K47)', id: 'p_live_duc' },
  { name: 'Hoàng Diệu Hương (K46)', id: 'p_live_huong' }
];

let activeSessionId = null;
let sessionLive = false;
let sessionEnded = false;
const studentClients = [];

// Monitor Host
const monitor = mqtt.connect(BROKER, { clean: true });

monitor.on('connect', () => {
  console.log(`⏳ Đang lắng nghe tín hiệu từ máy chủ Vercel phòng ${ROOM_CODE}...`);
  monitor.subscribe(`hcm/v2/room/${ROOM_CODE}/state`);
  monitor.subscribe(`hcm/v2/room/${ROOM_CODE}/host`);
});

monitor.on('message', (topic, payload) => {
  try {
    const data = JSON.parse(payload.toString());

    if (topic === `hcm/v2/room/${ROOM_CODE}/state`) {
      if (data.status === 'lobby' && data.sessionId !== activeSessionId) {
        activeSessionId = data.sessionId;
        sessionLive = false;
        sessionEnded = false;
        console.log(`\n🎉 [PHÒNG ĐÃ MỞ TRÊN VERCEL!] Session ID: ${activeSessionId}`);
        console.log(`👥 Đang đưa ${STUDENTS.length} thí sinh vào phòng chờ của bạn...\n`);
        joinStudents(activeSessionId);
      } else if (data.status === 'closed') {
        console.log(`\n🔴 [TÍN HIỆU RETAINED: CLOSED] Phòng ${ROOM_CODE} đã được Admin đóng trên Vercel!`);
      }
    }

    if (topic === `hcm/v2/room/${ROOM_CODE}/host`) {
      if (data.type === 'SESSION_START' && !sessionLive) {
        sessionLive = true;
        console.log('\n🚀 [ADMIN ĐÃ BẤM BẮT ĐẦU TRÊN VERCEL!] Các thí sinh bắt đầu làm bài...');
        startStudentAnswering(activeSessionId);
      } else if (data.type === 'SESSION_END' && !sessionEnded) {
        sessionEnded = true;
        console.log('\n🏁 [ADMIN ĐÃ BẤM TỔNG KẾT TRÊN VERCEL!] Bảng xếp hạng đồng bộ nhận được:');
        if (data.playersList) {
          console.table(data.playersList.map(p => ({
            Hạng: '#' + p.rank,
            Tên: p.name,
            Quý: `${p.quarter}/16`,
            Điểm: p.score + 'đ'
          })));
        }
      } else if (data.type === 'ROOM_CLOSED') {
        console.log('\n🛑 [ADMIN ĐÃ BẤM ĐÓNG PHÒNG TRÊN VERCEL!] Tín hiệu ROOM_CLOSED đã đến!');
        console.log('👉 Tất cả thí sinh lập tức ngắt kết nối và rời phòng thành công.');
        cleanupAll();
        setTimeout(() => process.exit(0), 1000);
      }
    }
  } catch (e) {}
});

function joinStudents(sessionId) {
  cleanupAll();
  STUDENTS.forEach((s, idx) => {
    setTimeout(() => {
      const client = mqtt.connect(BROKER, {
        clientId: 'bot_' + s.id + '_' + Math.random().toString(36).substring(2, 6),
        clean: true
      });

      studentClients.push(client);

      client.on('connect', () => {
        client.subscribe(`hcm/v2/room/${ROOM_CODE}/host`);

        // Send initial join
        client.publish(
          `hcm/v2/room/${ROOM_CODE}/students/${s.id}`,
          JSON.stringify({
            type: 'PLAYER_JOIN',
            playerId: s.id,
            name: s.name,
            sessionId: sessionId
          })
        );
        console.log(`  [+] ${s.name} đã vào phòng chờ!`);

        // Send heartbeat while in lobby
        const hb = setInterval(() => {
          if (!sessionLive && client.connected) {
            client.publish(
              `hcm/v2/room/${ROOM_CODE}/students/${s.id}`,
              JSON.stringify({
                type: 'PLAYER_JOIN',
                playerId: s.id,
                name: s.name,
                sessionId: sessionId
              })
            );
          } else {
            clearInterval(hb);
          }
        }, 2500);
      });
    }, idx * 400);
  });
}

function startStudentAnswering(sessionId) {
  STUDENTS.forEach((s, idx) => {
    let q = 1;
    let score = 60;
    const client = studentClients[idx];
    if (!client) return;

    const interval = setInterval(() => {
      if (!sessionLive || sessionEnded || !client.connected) {
        clearInterval(interval);
        return;
      }
      if (q < 16) {
        q++;
        score = Math.min(95, Math.max(35, score + Math.floor(Math.random() * 8) - 2));
        client.publish(
          `hcm/v2/room/${ROOM_CODE}/students/${s.id}`,
          JSON.stringify({
            type: 'PLAYER_PROGRESS',
            playerId: s.id,
            name: s.name,
            quarter: q,
            score: score,
            status: 'playing',
            rankTitle: score >= 75 ? 'Cán Bộ Tiêu Biểu' : 'Cán Bộ Năng Động',
            sessionId: sessionId
          })
        );
        console.log(`  📈 ${s.name} đã hoàn thành Quý ${q}/16 (${score}đ)`);
      } else {
        clearInterval(interval);
        client.publish(
          `hcm/v2/room/${ROOM_CODE}/students/${s.id}`,
          JSON.stringify({
            type: 'PLAYER_FINISH',
            playerId: s.id,
            name: s.name,
            quartersSurvived: 16,
            score: score,
            rankTitle: 'Công Bộc Mẫu Mực',
            sessionId: sessionId
          })
        );
        console.log(`  ⭐ ${s.name} đã hoàn thành toàn bộ 16 Quý!`);
      }
    }, 1800 + Math.random() * 800);
  });
}

function cleanupAll() {
  while (studentClients.length > 0) {
    const c = studentClients.pop();
    try { c.end(true); } catch (e) {}
  }
}

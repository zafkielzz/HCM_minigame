// High-Performance Load Testing Script for HCM Multiplayer Classroom Game
// Simulates 20-50+ realistic students joining, playing live, and finishing
// Usage: node load_test.mjs [ROOM_CODE] [BOT_COUNT]

import mqtt from 'mqtt';

const BROKER = 'wss://iot.coreflux.cloud:443/mqtt';
const ROOM_CODE = (process.argv[2] || 'HCM1945').trim().toUpperCase();
const BOT_COUNT = parseInt(process.argv[3]) || 25;

const FIRST_NAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đỗ', 'Bùi', 'Dương', 'Đặng', 'Hồ', 'Trịnh', 'Phan', 'Ngô'];
const MIDDLE_NAMES = ['Văn', 'Thị', 'Hoàng', 'Thành', 'Minh', 'Ngọc', 'Quốc', 'Diệu', 'Tuấn', 'Mai', 'Gia', 'Đức', 'Quỳnh', 'Thảo'];
const LAST_NAMES = ['An', 'Bình', 'Cường', 'Duy', 'Đức', 'Hương', 'Khánh', 'Linh', 'Nam', 'Nga', 'Phát', 'Quân', 'Sơn', 'Trang', 'Vy', 'Yến', 'Khoa', 'Tú', 'Long', 'Bảo'];

function generateNames(count) {
  const names = new Set();
  let index = 1;
  while (names.size < count) {
    const f = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const m = MIDDLE_NAMES[Math.floor(Math.random() * MIDDLE_NAMES.length)];
    const l = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const candidate = `${f} ${m} ${l}`;
    if (!names.has(candidate)) {
      names.add(candidate);
    }
  }
  return Array.from(names).map((name, i) => ({
    name: `${name} (K${45 + (i % 4)})`,
    skill: i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low',
    targetQuarters: i % 4 === 0 ? 10 + Math.floor(Math.random() * 4) : 16
  }));
}

const STUDENTS = generateNames(BOT_COUNT);

console.log('\n===============================================================');
console.log('🚀 HCM MULTIPLAYER STRESS / LOAD TESTER');
console.log(`📡 Broker: ${BROKER}`);
console.log(`🏫 Mã phòng mục tiêu: ${ROOM_CODE}`);
console.log(`👥 Số lượng sinh viên mô phỏng: ${BOT_COUNT} thí sinh`);
console.log('===============================================================\n');

let activeSessionId = null;
let sessionStarted = false;
let sessionEnded = false;
let spawnedClients = [];

// Monitor Host Room
const monitor = mqtt.connect(BROKER, {
  clientId: 'load_monitor_' + Math.random().toString(36).substring(2, 8),
  clean: true
});

monitor.on('connect', () => {
  console.log(`🔍 Monitor đã kết nối. Đang kiểm tra trạng thái phòng [${ROOM_CODE}]...`);
  monitor.subscribe(`hcm/v2/room/${ROOM_CODE}/state`, { qos: 1 });
  monitor.subscribe(`hcm/v2/room/${ROOM_CODE}/host`, { qos: 0 });
});

monitor.on('message', (topic, payload) => {
  const raw = payload.toString().trim();
  if (!raw) return;
  try {
    const data = JSON.parse(raw);

    if (topic === `hcm/v2/room/${ROOM_CODE}/state`) {
      if (data.status === 'lobby' && data.sessionId && data.sessionId !== activeSessionId) {
        activeSessionId = data.sessionId;
        sessionStarted = false;
        sessionEnded = false;
        console.log(`\n🎉 [PHÁT HIỆN PHÒNG CHỜ] Room: ${ROOM_CODE} | Session: ${activeSessionId}`);
        console.log(`👉 Đang cho ${BOT_COUNT} thí sinh tuần tự vào phòng chờ...\n`);
        launchStudents(activeSessionId);
      } else if (data.status === 'live' && !sessionStarted) {
        sessionStarted = true;
        console.log(`\n🚀 [ADMIN BẤM BẮT ĐẦU] Tất cả thí sinh bắt đầu làm bài!\n`);
      } else if (data.status === 'summary' && !sessionEnded) {
        sessionEnded = true;
        console.log(`\n🏁 [ADMIN KẾT THÚC PHIÊN] Đang chờ bảng xếp hạng...\n`);
      } else if (data.status === 'closed') {
        console.log(`\n🚪 [PHÒNG ĐÃ ĐÓNG] Chủ phòng đã đóng phòng thi đấu.`);
        cleanup();
      }
    }

    if (topic === `hcm/v2/room/${ROOM_CODE}/host`) {
      if (data.type === 'SESSION_START' && !sessionStarted) {
        sessionStarted = true;
        console.log(`\n🚀 [TÍN HIỆU SESSION_START] ${BOT_COUNT} thí sinh bắt đầu vuốt thẻ quyết sách!\n`);
      } else if (data.type === 'SESSION_END' && !sessionEnded) {
        sessionEnded = true;
        console.log(`\n🏆 [KẾT QUẢ ĐỒNG BỘ SESSION_END TỪ MÁY CHỦ]:`);
        if (Array.isArray(data.playersList) && data.playersList.length > 0) {
          console.table(data.playersList.slice(0, 15).map(p => ({
            Hạng: '#' + p.rank,
            Tên: p.name,
            'Quý': `${p.quarter}/16`,
            'Điểm': p.score + 'đ',
            'Danh hiệu': p.rankTitle
          })));
          console.log(`... và ${Math.max(0, data.playersList.length - 15)} thí sinh khác.`);
        }
        console.log(`\n✅ TEST HOÀN TẤT THÀNH CÔNG RỰC RỠ! Toàn bộ ${BOT_COUNT} thí sinh đã đồng bộ mượt mà.`);
      } else if (data.type === 'ROOM_CLOSED') {
        console.log(`\n🛑 [ROOM_CLOSED] Host giải tán phòng.`);
        cleanup();
      }
    }
  } catch (err) {}
});

function launchStudents(sessionId) {
  // Clean up any old clients first
  cleanupClients();

  STUDENTS.forEach((student, index) => {
    // Stagger joins by 150ms for realistic entrance into the lobby
    setTimeout(() => {
      if (sessionStarted || sessionEnded) return;

      const studentId = `p_loadbot_${index + 1}`;
      const client = mqtt.connect(BROKER, {
        clientId: `bot_${studentId}_` + Math.random().toString(36).substring(2, 6),
        clean: true
      });

      spawnedClients.push(client);

      let currentQuarter = 1;
      let score = student.skill === 'high' ? 75 : student.skill === 'medium' ? 65 : 55;
      let stats = { people: score, law: score, integrity: score, reform: score };

      client.on('connect', () => {
        client.subscribe(`hcm/v2/room/${ROOM_CODE}/host`, { qos: 0 });
        client.subscribe(`hcm/v2/room/${ROOM_CODE}/state`, { qos: 1 });

        // Gửi gói tin JOIN
        client.publish(
          `hcm/v2/room/${ROOM_CODE}/students/${studentId}`,
          JSON.stringify({
            type: 'PLAYER_JOIN',
            playerId: studentId,
            name: student.name,
            sessionId: sessionId
          })
        );
        console.log(`  [+${index + 1}/${BOT_COUNT}] ${student.name} đã vào phòng chờ.`);

        // Duy trì Heartbeat định kỳ 2.5s khi ở phòng chờ
        const lobbyHb = setInterval(() => {
          if (!sessionStarted && client.connected) {
            client.publish(
              `hcm/v2/room/${ROOM_CODE}/students/${studentId}`,
              JSON.stringify({
                type: 'PLAYER_JOIN',
                playerId: studentId,
                name: student.name,
                sessionId: sessionId
              })
            );
          } else {
            clearInterval(lobbyHb);
          }
        }, 2500);
      });

      // Vòng lặp chơi game khi host phát lệnh SESSION_START
      const playTimer = setInterval(() => {
        if (!sessionStarted || sessionEnded || !client.connected) return;

        if (currentQuarter < student.targetQuarters) {
          currentQuarter++;
          const delta = Math.floor(Math.random() * 5) - 2;
          score = Math.max(35, Math.min(96, score + delta));

          client.publish(
            `hcm/v2/room/${ROOM_CODE}/students/${studentId}`,
            JSON.stringify({
              type: 'PLAYER_PROGRESS',
              playerId: studentId,
              name: student.name,
              quarter: currentQuarter,
              stats: stats,
              score: score,
              status: 'playing',
              rankTitle: score >= 80 ? 'Công Bộc Mẫu Mực' : 'Cán Bộ Năng Động',
              sessionId: sessionId
            })
          );
          if (index < 5 || currentQuarter % 4 === 0) {
            console.log(`    ⏩ [Tiến độ] ${student.name} -> Quý ${currentQuarter}/16 (${score}đ)`);
          }
        } else {
          clearInterval(playTimer);
          const isFinished = student.targetQuarters >= 16;
          client.publish(
            `hcm/v2/room/${ROOM_CODE}/students/${studentId}`,
            JSON.stringify({
              type: 'PLAYER_FINISH',
              playerId: studentId,
              name: student.name,
              quartersSurvived: currentQuarter,
              stats: stats,
              score: score,
              status: isFinished ? 'finished' : 'failed',
              rankTitle: isFinished ? 'Công Bộc Xuất Sắc Toàn Diện' : 'Cán Bộ Cần Rút Kinh Nghiệm',
              sessionId: sessionId
            })
          );
          console.log(`    🏁 [Hoàn tất] ${student.name} -> ${isFinished ? 'VỀ ĐÍCH 16 QUÝ' : 'Dừng ở Quý ' + currentQuarter} (${score}đ)`);
        }
      }, 1400 + Math.random() * 1200); // Mỗi câu trả lời mất 1.4s - 2.6s

    }, index * 150);
  });
}

function cleanupClients() {
  spawnedClients.forEach(c => {
    try { c.end(true); } catch (e) {}
  });
  spawnedClients = [];
}

function cleanup() {
  cleanupClients();
  try { monitor.end(true); } catch (e) {}
  setTimeout(() => process.exit(0), 1000);
}

process.on('SIGINT', () => {
  console.log('\nĐang ngắt kết nối các bot...');
  cleanup();
});

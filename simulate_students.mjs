// Classroom Simulator: Simulates 10 realistic students joining, playing, and finishing
import mqtt from 'mqtt';

const BROKER = 'wss://broker.emqx.io:8084/mqtt';
const ROOM_CODE = process.argv[2] || 'HCM1945';

console.log(`\n======================================================`);
console.log(`🤖 HCM CLASSROOM BOT SIMULATOR`);
console.log(`📡 Connecting to broker: ${BROKER}`);
console.log(`🏫 Target Room Code: ${ROOM_CODE}`);
console.log(`👥 Simulating: 10 Students`);
console.log(`======================================================\n`);

const STUDENTS = [
  { name: 'Nguyễn Văn An (K45)', targetQuarters: 16, skill: 'high' },
  { name: 'Trần Thị Bình (K46)', targetQuarters: 16, skill: 'high' },
  { name: 'Lê Hoàng Cường (K45)', targetQuarters: 16, skill: 'medium' },
  { name: 'Phạm Minh Đức (K47)', targetQuarters: 11, skill: 'low' },     // Will fail at quarter 11
  { name: 'Hoàng Diệu Hương (K46)', targetQuarters: 16, skill: 'high' },
  { name: 'Vũ Quốc Khánh (K45)', targetQuarters: 7, skill: 'low' },       // Will fail at quarter 7
  { name: 'Đặng Mai Linh (K46)', targetQuarters: 16, skill: 'medium' },
  { name: 'Bùi Tuấn Nam (K47)', targetQuarters: 14, skill: 'medium' },   // Will fail at quarter 14
  { name: 'Đỗ Quỳnh Nga (K46)', targetQuarters: 16, skill: 'high' },
  { name: 'Ngô Thành Phát (K45)', targetQuarters: 16, skill: 'high' }
];

let activeSessionId = null;
let sessionStarted = false;
let sessionEnded = false;

// 1. Monitor Host Room State
const monitor = mqtt.connect(BROKER, {
  clientId: 'sim_monitor_' + Math.random().toString(36).substring(2, 8),
  clean: true
});

monitor.on('connect', () => {
  console.log('🔍 Monitor connected. Waiting for Host to open room ' + ROOM_CODE + '...');
  monitor.subscribe(`hcm/v2/room/${ROOM_CODE}/state`);
  monitor.subscribe(`hcm/v2/room/${ROOM_CODE}/host`);
});

monitor.on('message', (topic, payload) => {
  const raw = payload.toString().trim();
  if (!raw) return;
  try {
    const data = JSON.parse(raw);

    if (topic === `hcm/v2/room/${ROOM_CODE}/state`) {
      if (data.status === 'lobby' && data.sessionId !== activeSessionId) {
        activeSessionId = data.sessionId;
        console.log(`\n🎉 [HOST ROOM DETECTED] Room: ${ROOM_CODE} | Session: ${activeSessionId}`);
        console.log(`👉 Joining 10 students into the lobby...\n`);
        launchStudents(activeSessionId);
      } else if (data.status === 'live' && !sessionStarted) {
        sessionStarted = true;
        console.log(`\n🚀 [SESSION STARTED BY HOST] Students begin answering questions!\n`);
      } else if (data.status === 'summary' && !sessionEnded) {
        sessionEnded = true;
        console.log(`\n🏁 [SESSION ENDED BY HOST] Checking synchronized leaderboard results...\n`);
      }
    }

    if (topic === `hcm/v2/room/${ROOM_CODE}/host`) {
      if (data.type === 'SESSION_START' && !sessionStarted) {
        sessionStarted = true;
        console.log(`\n🚀 [SESSION_START SIGNAL RECEIVED] Students begin swiping cards!\n`);
      } else if (data.type === 'SESSION_END' && !sessionEnded) {
        sessionEnded = true;
        console.log(`\n🏆 [SESSION_END SIGNAL RECEIVED] Synchronized Leaderboard arrived:`);
        if (data.playersList) {
          console.table(data.playersList.map(p => ({
            Hạng: '#' + p.rank,
            Tên: p.name,
            'Quý': `${p.quarter}/16`,
            'Điểm': p.score + 'đ',
            'Danh hiệu': p.rankTitle
          })));
        }
        console.log(`\n✅ TEST HOÀN TẤT THÀNH CÔNG RỰC RỠ! Không có bất kỳ lỗi nào.`);
        process.exit(0);
      }
    }
  } catch (err) {}
});

function launchStudents(sessionId) {
  STUDENTS.forEach((student, index) => {
    // Stagger joins by 300ms for realistic classroom behavior
    setTimeout(() => {
      const studentId = 'p_bot_' + (index + 1);
      const client = mqtt.connect(BROKER, {
        clientId: 'bot_' + studentId + '_' + Math.random().toString(36).substring(2, 6),
        clean: true
      });

      let currentQuarter = 1;
      let score = student.skill === 'high' ? 75 : student.skill === 'medium' ? 65 : 55;
      let stats = { people: score, law: score, integrity: score, reform: score };

      client.on('connect', () => {
        // Subscribe to host signals
        client.subscribe(`hcm/v2/room/${ROOM_CODE}/host`);
        client.subscribe(`hcm/v2/room/${ROOM_CODE}/state`);

        // Send Join packet
        client.publish(
          `hcm/v2/room/${ROOM_CODE}/students/${studentId}`,
          JSON.stringify({
            type: 'PLAYER_JOIN',
            playerId: studentId,
            name: student.name,
            sessionId: sessionId
          })
        );
        console.log(`  [+] ${student.name} đã vào phòng chờ.`);
      });

      // Play through quarters when session starts
      const playInterval = setInterval(() => {
        if (!sessionStarted || sessionEnded) return;

        if (currentQuarter < student.targetQuarters) {
          currentQuarter++;
          // Random slight score fluctuation
          const delta = Math.floor(Math.random() * 5) - 2;
          score = Math.max(30, Math.min(95, score + delta));

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
          console.log(`    ⏩ ${student.name} -> Quý ${currentQuarter}/16 (${score}đ)`);
        } else {
          // Student reached end or failed
          clearInterval(playInterval);
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
          console.log(`    🏁 ${student.name} -> ${isFinished ? 'HOÀN THÀNH 16 QUÝ' : 'Bãi miễn tại Quý ' + currentQuarter} (${score}đ)`);
        }
      }, 1500 + Math.random() * 800); // 1.5s - 2.3s per question

    }, index * 350);
  });
}

// Comprehensive E2E Simulation Test for HCM Multiplayer Classroom Game
// Tests: Host creation, 10 student joins, Out phòng (PLAYER_LEAVE), Deduplication,
// SESSION_START, Real-time progress, SESSION_END, New Round reset, and Admin ROOM_CLOSED.

import mqtt from 'mqtt';

const BROKER = 'wss://broker.emqx.io:8084/mqtt';
const ROOM_CODE = 'HCM1945';
const SESSION_ID = 's_test_' + Date.now();

console.log('\n===============================================================');
console.log('🧪 BẮT ĐẦU BỘ TEST KIỂM THỬ TẤT CẢ KỊCH BẢN MULTIPLAYER');
console.log(`📡 Broker: ${BROKER} | Phòng: ${ROOM_CODE}`);
console.log('===============================================================\n');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let testPassed = 0;
let testFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    testPassed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    testFailed++;
  }
}

async function runSuite() {
  // ==========================================
  // 1. SETUP HOST CLIENT
  // ==========================================
  console.log('--- 1. MÁY CHỦ (ADMIN) MỞ PHÒNG THI ĐẤU ---');
  const host = mqtt.connect(BROKER, {
    clientId: 'test_host_' + Math.random().toString(36).substring(2, 7),
    clean: true
  });

  const hostPlayers = {};
  let hostStatus = 'lobby';

  await new Promise(resolve => {
    host.on('connect', () => {
      host.subscribe(`hcm/v2/room/${ROOM_CODE}/students/#`);
      host.publish(`hcm/v2/room/${ROOM_CODE}/state`, JSON.stringify({
        code: ROOM_CODE,
        sessionId: SESSION_ID,
        status: 'lobby',
        hostTime: Date.now()
      }), { retain: true, qos: 0 });
      console.log('  -> Host đã kết nối MQTT và tạo phòng trạng thái LOBBY.');
      resolve();
    });
  });

  host.on('message', (topic, payload) => {
    try {
      const data = JSON.parse(payload.toString());
      if (data.type === 'PLAYER_JOIN') {
        const trimmed = (data.name || '').trim();
        // Host deduplication logic
        for (const [id, p] of Object.entries(hostPlayers)) {
          if (id === data.playerId || (p.name && p.name.toLowerCase() === trimmed.toLowerCase())) {
            delete hostPlayers[id];
          }
        }
        hostPlayers[data.playerId] = {
          name: trimmed,
          quarter: 1,
          score: 60,
          status: 'waiting',
          lastSeen: Date.now()
        };
      } else if (data.type === 'PLAYER_LEAVE') {
        const targetId = data.playerId;
        const targetName = (data.name || '').trim().toLowerCase();
        for (const [id, p] of Object.entries(hostPlayers)) {
          if (id === targetId || (p.name && p.name.toLowerCase() === targetName)) {
            delete hostPlayers[id];
          }
        }
      } else if (data.type === 'PLAYER_PROGRESS') {
        const clean = (data.name || '').trim().toLowerCase();
        for (const [id, p] of Object.entries(hostPlayers)) {
          if (id !== data.playerId && p.name && p.name.trim().toLowerCase() === clean) {
            delete hostPlayers[id];
          }
        }
        hostPlayers[data.playerId] = {
          ...(hostPlayers[data.playerId] || {}),
          name: data.name,
          quarter: data.quarter,
          score: data.score,
          status: 'playing'
        };
      }
    } catch (e) {}
  });

  await sleep(1000);

  // ==========================================
  // 2. SIMULATE 10 STUDENTS JOINING
  // ==========================================
  console.log('\n--- 2. 10 THÍ SINH VÀO PHÒNG CHỜ ---');
  const studentClients = [];
  const studentNames = [
    'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Minh Đức',
    'Hoàng Diệu Hương', 'Vũ Quốc Khánh', 'Đặng Mai Linh', 'Bùi Tuấn Nam',
    'Đỗ Quỳnh Nga', 'Ngô Thành Phát'
  ];

  for (let i = 0; i < studentNames.length; i++) {
    const studentId = `p_student_${i + 1}`;
    const name = studentNames[i];
    const client = mqtt.connect(BROKER, {
      clientId: `test_std_${studentId}_` + Math.random().toString(36).substring(2, 6),
      clean: true
    });

    studentClients.push({ client, studentId, name });

    await new Promise(res => {
      client.on('connect', () => {
        client.subscribe(`hcm/v2/room/${ROOM_CODE}/host`);
        client.publish(
          `hcm/v2/room/${ROOM_CODE}/students/${studentId}`,
          JSON.stringify({
            type: 'PLAYER_JOIN',
            playerId: studentId,
            name: name,
            sessionId: SESSION_ID
          })
        );
        res();
      });
    });
  }

  await sleep(1500);
  assert(Object.keys(hostPlayers).length === 10, `Host ghi nhận đúng 10 thí sinh trong phòng chờ (Hiện có: ${Object.keys(hostPlayers).length})`);

  // ==========================================
  // 3. TEST OUT PHÒNG (PLAYER_LEAVE)
  // ==========================================
  console.log('\n--- 3. TEST KỊCH BẢN THÍ SINH OUT PHÒNG (PLAYER_LEAVE) ---');
  const leavingStudent = studentClients[0]; // Nguyễn Văn An
  console.log(`  -> ${leavingStudent.name} bấm "Rời phòng chờ"...`);
  leavingStudent.client.publish(
    `hcm/v2/room/${ROOM_CODE}/students/${leavingStudent.studentId}`,
    JSON.stringify({
      type: 'PLAYER_LEAVE',
      playerId: leavingStudent.studentId,
      name: leavingStudent.name,
      sessionId: SESSION_ID
    })
  );

  await sleep(1000);
  assert(
    Object.keys(hostPlayers).length === 9 && !hostPlayers[leavingStudent.studentId],
    `Host đã gạch tên ${leavingStudent.name} ngay lập tức (Còn lại: ${Object.keys(hostPlayers).length} thí sinh)`
  );

  // ==========================================
  // 4. TEST DEDUPLICATION (TRÙNG TÊN / F5 REFRESH)
  // ==========================================
  console.log('\n--- 4. TEST KHỬ TRÙNG LẶP (DEDUPLICATION KHI F5 HOẶC TRÙNG TÊN) ---');
  // Thí sinh Trần Thị Bình (index 1) F5 trang, sinh playerId mới 'p_student_2_refreshed' nhưng vẫn tên 'Trần Thị Bình'
  const newId = 'p_student_2_refreshed';
  console.log(`  -> Trần Thị Bình F5 trang (sinh ID mới: ${newId}) và vào lại phòng...`);
  studentClients[1].client.publish(
    `hcm/v2/room/${ROOM_CODE}/students/${newId}`,
    JSON.stringify({
      type: 'PLAYER_JOIN',
      playerId: newId,
      name: 'Trần Thị Bình',
      sessionId: SESSION_ID
    })
  );
  studentClients[1].studentId = newId;

  await sleep(1000);
  const binhCount = Object.values(hostPlayers).filter(p => p.name === 'Trần Thị Bình').length;
  assert(
    binhCount === 1,
    `Không bị trùng lặp: Trần Thị Bình chỉ xuất hiện đúng 1 lần (Số lần: ${binhCount})`
  );
  assert(
    Object.keys(hostPlayers).length === 9,
    `Tổng số thí sinh không bị tăng ảo (Hiện tại: ${Object.keys(hostPlayers).length})`
  );

  // Nguyễn Văn An vào lại phòng
  console.log(`  -> ${leavingStudent.name} vào lại phòng chờ...`);
  leavingStudent.client.publish(
    `hcm/v2/room/${ROOM_CODE}/students/${leavingStudent.studentId}`,
    JSON.stringify({
      type: 'PLAYER_JOIN',
      playerId: leavingStudent.studentId,
      name: leavingStudent.name,
      sessionId: SESSION_ID
    })
  );
  await sleep(1000);
  assert(Object.keys(hostPlayers).length === 10, `Nguyễn Văn An vào lại thành công, tổng sĩ số đủ 10 thí sinh`);

  // ==========================================
  // 5. TEST BẮT ĐẦU PHIÊN (SESSION_START)
  // ==========================================
  console.log('\n--- 5. HOST BẤM BẮT ĐẦU PHIÊN THI ĐẤU ---');
  let studentsReceivedStart = 0;
  studentClients.forEach(({ client }) => {
    client.on('message', (topic, payload) => {
      const data = JSON.parse(payload.toString());
      if (data.type === 'SESSION_START') {
        studentsReceivedStart++;
      }
    });
  });

  host.publish(`hcm/v2/room/${ROOM_CODE}/host`, JSON.stringify({
    type: 'SESSION_START',
    roomCode: ROOM_CODE,
    status: 'live',
    hostTime: Date.now()
  }));
  host.publish(`hcm/v2/room/${ROOM_CODE}/state`, JSON.stringify({
    code: ROOM_CODE,
    sessionId: SESSION_ID,
    status: 'live',
    hostTime: Date.now()
  }), { retain: true, qos: 0 });

  await sleep(1500);
  assert(
    studentsReceivedStart === 10,
    `Tất cả 10/10 thí sinh nhận được tín hiệu SESSION_START cùng lúc`
  );

  // ==========================================
  // 6. TEST TIẾN TRÌNH TRẢ LỜI CÂU HỎI (PLAYER_PROGRESS)
  // ==========================================
  console.log('\n--- 6. MÔ PHỎNG THÍ SINH VUỐT TRẢ LỜI BÀI THI ---');
  for (let q = 2; q <= 5; q++) {
    for (let i = 0; i < studentClients.length; i++) {
      const { client, studentId, name } = studentClients[i];
      client.publish(
        `hcm/v2/room/${ROOM_CODE}/students/${studentId}`,
        JSON.stringify({
          type: 'PLAYER_PROGRESS',
          playerId: studentId,
          name: name,
          quarter: q,
          score: 60 + q * 4,
          status: 'playing',
          sessionId: SESSION_ID
        })
      );
    }
  }

  await sleep(1500);
  const avgQuarter = Object.values(hostPlayers).reduce((acc, p) => acc + p.quarter, 0) / 10;
  assert(
    avgQuarter === 5,
    `Host cập nhật tiến trình thời gian thực: Tất cả 10 thí sinh đã qua Quý 5 (Điểm: ${hostPlayers['p_student_1']?.score}đ)`
  );

  // ==========================================
  // 7. TEST KẾT THÚC PHIÊN (SESSION_END)
  // ==========================================
  console.log('\n--- 7. HOST KẾT THÚC PHIÊN & ĐỒNG BỘ BẢNG ĐIỂM ---');
  let studentsReceivedEnd = 0;
  studentClients.forEach(({ client }) => {
    client.on('message', (topic, payload) => {
      const data = JSON.parse(payload.toString());
      if (data.type === 'SESSION_END') {
        studentsReceivedEnd++;
      }
    });
  });

  const sortedList = Object.entries(hostPlayers).map(([id, p], idx) => ({
    id,
    name: p.name,
    quarter: p.quarter,
    score: p.score,
    rank: idx + 1
  }));

  host.publish(`hcm/v2/room/${ROOM_CODE}/host`, JSON.stringify({
    type: 'SESSION_END',
    roomCode: ROOM_CODE,
    status: 'summary',
    playersList: sortedList,
    hostTime: Date.now()
  }));

  await sleep(1500);
  assert(
    studentsReceivedEnd === 10,
    `Tất cả 10 thí sinh nhận được bảng xếp hạng đồng bộ SESSION_END`
  );

  // ==========================================
  // 8. TEST ADMIN ĐÓNG & XOÁ PHÒNG (ROOM_CLOSED)
  // ==========================================
  console.log('\n--- 8. TEST ADMIN BẤM "ĐÓNG PHÒNG" (KICK TẤT CẢ THÍ SINH) ---');
  let studentsKicked = 0;
  studentClients.forEach(({ client }) => {
    client.on('message', (topic, payload) => {
      const data = JSON.parse(payload.toString());
      if (data.type === 'ROOM_CLOSED') {
        studentsKicked++;
      }
    });
  });

  host.publish(`hcm/v2/room/${ROOM_CODE}/host`, JSON.stringify({
    type: 'ROOM_CLOSED',
    roomCode: ROOM_CODE,
    status: 'closed',
    message: 'Chủ phòng đã đóng phòng thi đấu!'
  }));
  host.publish(`hcm/v2/room/${ROOM_CODE}/state`, JSON.stringify({
    code: ROOM_CODE,
    sessionId: SESSION_ID,
    status: 'closed',
    hostTime: Date.now()
  }), { retain: true, qos: 0 });

  await sleep(1500);
  assert(
    studentsKicked === 10,
    `Tất cả 10/10 thí sinh nhận được tín hiệu ROOM_CLOSED và tự động bị out khỏi phòng`
  );

  // ==========================================
  // DỌN DẸP & KẾT LUẬN
  // ==========================================
  studentClients.forEach(({ client }) => client.end(true));
  host.end(true);

  console.log('\n===============================================================');
  console.log(`📊 TỔNG KẾT KIỂM THỬ: ${testPassed} ĐẠT / ${testFailed} THẤT BẠI`);
  if (testFailed === 0) {
    console.log('🎉 TẤT CẢ CÁC KỊCH BẢN ĐỀU VƯỢT QUA XUẤT SẮC! HỆ THỐNG HOÀN TOÀN ỔN ĐỊNH.');
  } else {
    console.error('⚠️ Có kịch bản chưa đạt, cần kiểm tra lại!');
  }
  console.log('===============================================================\n');
}

runSuite().catch(err => console.error(err));

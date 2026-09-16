    // -------------------------------------------------------------
    // 3. Textures
    // -------------------------------------------------------------
    function genAuthenticWallTex() {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#c8ae58'; ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = '#b29744'; ctx.lineWidth = 2;
      for (let y = 0; y < 512; y += 32) {
        for (let x = 0; x < 512; x += 32) {
          ctx.beginPath();
          ctx.moveTo(x + 16, y); ctx.lineTo(x + 32, y + 16);
          ctx.lineTo(x + 16, y + 32); ctx.lineTo(x, y + 16);
          ctx.closePath(); ctx.stroke();
          ctx.strokeRect(x + 13, y + 13, 6, 6);
        }
      }

      ctx.fillStyle = 'rgba(38, 30, 8, 0.2)';
      for (let i = 0; i < 8; i++) {
        const sx = 40 + i * 60;
        ctx.beginPath();
        ctx.moveTo(sx, 0); ctx.lineTo(sx + 16, 0);
        ctx.lineTo(sx + 8, 120 + Math.sin(i) * 60);
        ctx.fill();
      }

      const baseH = 48;
      ctx.fillStyle = '#3a2a18'; ctx.fillRect(0, 512 - baseH, 512, baseH);
      ctx.fillStyle = '#22170c'; ctx.fillRect(0, 512 - baseH, 512, 5);
      ctx.fillRect(0, 512 - 6, 512, 6);

      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      return t;
    }

    // ผนังสีออฟฟิศปกติ (ทาสีเรียบ + รอยต่อแผ่นยิปซัม) — ใช้ก่อนไฟดับครั้งแรก ยังไม่มีลาย Backrooms
    function genOfficeWallTex() {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#dad5c8'; ctx.fillRect(0, 0, 512, 512);

      // รอยต่อแผ่นผนังจางๆ แนวตั้ง
      ctx.strokeStyle = 'rgba(150, 143, 122, 0.35)'; ctx.lineWidth = 1.5;
      for (let x = 0; x < 512; x += 128) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
      }

      // เนื้อสีทาผนังไม่เรียบเนียนจนเกินไป
      ctx.fillStyle = 'rgba(120, 112, 92, 0.05)';
      for (let i = 0; i < 260; i++) {
        const sx = Math.random() * 512, sy = Math.random() * 512;
        ctx.fillRect(sx, sy, 2, 2);
      }

      // ขอบบัว (chair rail) กลางผนัง
      ctx.fillStyle = '#c7c0ac'; ctx.fillRect(0, 220, 512, 8);

      const baseH = 40;
      ctx.fillStyle = '#8f8873'; ctx.fillRect(0, 512 - baseH, 512, baseH);
      ctx.fillStyle = '#726c5a'; ctx.fillRect(0, 512 - baseH, 512, 4);

      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      return t;
    }

    // พรมออฟฟิศปกติ โทนเทาอมฟ้าสะอาดๆ ใช้ก่อนไฟดับครั้งแรก
    // ผิวหน้าโต๊ะทำงานไม้ลามิเนต แบบโต๊ะออฟฟิศทั่วไป
    function genDeskTopTex() {
      const c = document.createElement('canvas');
      c.width = 128; c.height = 128;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#a9835a'; ctx.fillRect(0, 0, 128, 128);
      ctx.strokeStyle = 'rgba(90, 62, 35, 0.35)'; ctx.lineWidth = 1;
      for (let y = 6; y < 128; y += 9) {
        ctx.beginPath();
        ctx.moveTo(0, y + Math.sin(y) * 2);
        ctx.lineTo(128, y + Math.cos(y) * 2);
        ctx.stroke();
      }
      const t = new THREE.CanvasTexture(c);
      return t;
    }

    // หน้าตู้เอกสารเหล็ก มีรอยลิ้นชักและรอยขีดข่วนจางๆ
    function genCabinetTex() {
      const c = document.createElement('canvas');
      c.width = 128; c.height = 256;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#8a8f96'; ctx.fillRect(0, 0, 128, 256);
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 3;
      for (let y = 0; y < 256; y += 64) {
        ctx.strokeRect(4, y + 4, 120, 56);
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(56, y + 26, 16, 6); // มือจับลิ้นชัก
      }
      const t = new THREE.CanvasTexture(c);
      return t;
    }

    // กระดานไวท์บอร์ดห้องประชุม มีกราฟ/ตารางประชุมเลือนๆ แบบออฟฟิศทั่วไป
    function genWhiteboardTex() {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 160;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#eef0ea'; ctx.fillRect(0, 0, 256, 160);
      ctx.strokeStyle = 'rgba(40,60,150,0.55)'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(15, 120); ctx.lineTo(60, 90); ctx.lineTo(100, 100); ctx.lineTo(150, 60); ctx.lineTo(200, 70); ctx.lineTo(240, 40);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(180,30,30,0.5)'; ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const x = 20 + Math.random() * 200, y = 15 + Math.random() * 25;
        ctx.strokeRect(x, y, 26 + Math.random() * 18, 12);
      }
      ctx.fillStyle = 'rgba(40,40,40,0.65)';
      ctx.font = '11px sans-serif';
      ctx.fillText('Q3 REVIEW', 16, 18);
      ctx.fillText('TARGETS', 150, 152);
      const t = new THREE.CanvasTexture(c);
      return t;
    }

    // แผงไฟกะพริบด้านหน้าตู้เซิร์ฟเวอร์ จุดไฟเขียว/น้ำเงินเรียงเป็นแถวสุ่ม
    function genServerLightsTex() {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 128;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#15181c'; ctx.fillRect(0, 0, 64, 128);
      for (let y = 6; y < 128; y += 10) {
        ctx.fillStyle = Math.random() < 0.6 ? '#1fae4a' : '#2255aa';
        ctx.fillRect(6, y, 6, 4);
        ctx.fillStyle = '#33383f';
        ctx.fillRect(16, y, 40, 4);
      }
      return new THREE.CanvasTexture(c);
    }

    function genOfficeCarpetTex() {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#6b7078'; ctx.fillRect(0, 0, 256, 256);

      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (let x = 0; x < 256; x += 4) {
        for (let y = 0; y < 256; y += 4) {
          if ((x + y) % 8 === 0) ctx.fillRect(x, y, 2, 2);
        }
      }

      // เส้นตารางพรมไทล์แบบออฟฟิศทั่วไป เรียบร้อยเป็นระเบียบ
      ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 1;
      for (let x = 0; x < 256; x += 64) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
      }
      for (let y = 0; y < 256; y += 64) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
      }

      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(70, 70);
      return t;
    }

    function genAuthenticCarpetTex() {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#5c5436'; ctx.fillRect(0, 0, 256, 256);

      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      for (let x = 0; x < 256; x += 4) {
        for (let y = 0; y < 256; y += 4) {
          if ((x + y) % 8 === 0) ctx.fillRect(x, y, 2, 2);
        }
      }

      ctx.fillStyle = 'rgba(22, 18, 8, 0.09)';
      ctx.beginPath();
      ctx.arc(150, 130, 34, 0, Math.PI * 2);
      ctx.fill();

      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(70, 70);
      return t;
    }

    function genAuthenticCeilingTex() {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#dcd5be'; ctx.fillRect(0, 0, 256, 256);

      ctx.strokeStyle = '#827c68'; ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, 256, 256);
      ctx.beginPath();
      ctx.moveTo(128, 0); ctx.lineTo(128, 256);
      ctx.moveTo(0, 128); ctx.lineTo(256, 128);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(90, 70, 30, 0.25)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(180, 80, 35, 0, Math.PI * 2);
      ctx.stroke();

      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(70, 70);
      return t;
    }

    // เพดานเวอร์ชัน "ป่วย" ของ backrooms — คราบน้ำเยอะขึ้น สีหม่นลง ใช้หลังไฟดับครั้งแรก
    function genSickCeilingTex() {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#cdbf8e'; ctx.fillRect(0, 0, 256, 256);

      ctx.strokeStyle = '#7a6c3f'; ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, 256, 256);
      ctx.beginPath();
      ctx.moveTo(128, 0); ctx.lineTo(128, 256);
      ctx.moveTo(0, 128); ctx.lineTo(256, 128);
      ctx.stroke();

      // คราบน้ำสีเข้มกระจายหลายจุด ดูทรุดโทรมกว่าเพดานออฟฟิศปกติ
      ctx.fillStyle = 'rgba(60, 45, 10, 0.28)';
      for (let i = 0; i < 5; i++) {
        const sx = 30 + Math.random() * 196, sy = 30 + Math.random() * 196;
        ctx.beginPath();
        ctx.arc(sx, sy, 18 + Math.random() * 24, 0, Math.PI * 2);
        ctx.fill();
      }

      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(70, 70);
      return t;
    }

    function genAlmondMilkTex() {
      const c = document.createElement('canvas');
      c.width = 128; c.height = 256;
      const ctx = c.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0)'; ctx.fillRect(0, 0, 128, 256);

      ctx.fillStyle = '#f5e6ca';
      ctx.shadowColor = '#fff3db';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.roundRect(32, 60, 64, 175, 10);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(46, 38, 36, 22);

      ctx.fillStyle = '#3a2713';
      ctx.fillRect(34, 115, 60, 55);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('ALMOND', 38, 138);
      ctx.fillText('MILK', 48, 154);

      return new THREE.CanvasTexture(c);
    }

    function genNoteTex() {
      const c = document.createElement('canvas');
      c.width = 96; c.height = 120;
      const ctx = c.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0)'; ctx.fillRect(0, 0, 96, 120);

      ctx.save();
      ctx.translate(48, 60);
      ctx.rotate(-0.05);
      ctx.fillStyle = '#e8dfc0';
      ctx.shadowColor = '#fff8dd';
      ctx.shadowBlur = 14;
      ctx.fillRect(-34, -44, 68, 88);
      ctx.restore();

      ctx.strokeStyle = 'rgba(90, 70, 30, 0.55)';
      ctx.lineWidth = 1.5;
      for (let y = -30; y <= 34; y += 11) {
        ctx.beginPath();
        ctx.moveTo(15, 22 + y * 0.98);
        ctx.lineTo(78, 20 + y * 0.98);
        ctx.stroke();
      }

      return new THREE.CanvasTexture(c);
    }

    function genKeycardTex() {
      const c = document.createElement('canvas');
      c.width = 96; c.height = 60;
      const ctx = c.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0)'; ctx.fillRect(0, 0, 96, 60);

      ctx.fillStyle = '#3a6ea5';
      ctx.shadowColor = '#8fd0ff';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.roundRect(8, 8, 80, 44, 6);
      ctx.fill();

      ctx.fillStyle = '#e8f4ff';
      ctx.fillRect(14, 16, 68, 8);
      ctx.fillStyle = '#ffcf3f';
      ctx.fillRect(14, 32, 24, 14);

      return new THREE.CanvasTexture(c);
    }


    // -------------------------------------------------------------
    // 4. สร้าง 3D Rig มอนสเตอร์ (ขยับแขนขาได้จริง)
    // -------------------------------------------------------------

    // ผิวหนัง The Bacteria: เนื้อเน่าเปื่อยสีเขียวคล้ำอมดำ ราขึ้น + ตุ่มหนองนูนบวม + รอยแผลแตกเหมือนติดเชื้อ
    function genBacteriaSkinTex() {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#171c12'; ctx.fillRect(0, 0, 256, 256);
      // คราบเน่า/รา กระจายไม่สม่ำเสมอทั่วตัว
      for (let i = 0; i < 220; i++) {
        const x = Math.random() * 256, y = Math.random() * 256, r = 3 + Math.random() * 15;
        ctx.fillStyle = Math.random() < 0.5 ? 'rgba(70,95,35,0.32)' : 'rgba(35,15,10,0.36)';
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      // ตุ่มหนองนูนบวมเรืองซีด ใช้ radial gradient ให้ดูมีมิติเหมือนบวมพร้อมแตก
      for (let i = 0; i < 55; i++) {
        const x = Math.random() * 256, y = Math.random() * 256, r = 2.5 + Math.random() * 6;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(165, 200, 95, 0.7)');
        g.addColorStop(0.6, 'rgba(120, 150, 70, 0.35)');
        g.addColorStop(1, 'rgba(120, 150, 70, 0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      // รอยแผล/รอยแตกลายแบบผิวติดเชื้อ
      ctx.strokeStyle = 'rgba(10,5,5,0.55)'; ctx.lineWidth = 1.2;
      for (let i = 0; i < 65; i++) {
        let x = Math.random() * 256, y = Math.random() * 256;
        ctx.beginPath(); ctx.moveTo(x, y);
        for (let j = 0; j < 4; j++) { x += (Math.random() - 0.5) * 18; y += (Math.random() - 0.5) * 18; ctx.lineTo(x, y); }
        ctx.stroke();
      }
      return new THREE.CanvasTexture(c);
    }

    // ผิวหนัง The Duller: ซีดเทาเหมือนศพแห้ง แตกระแหงลายงา จุดคล้ำเน่าตายกระจายทั่ว
    function genDullerSkinTex() {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#3a3d3a'; ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 190; i++) {
        const x = Math.random() * 256, y = Math.random() * 256, r = 3 + Math.random() * 16;
        ctx.fillStyle = Math.random() < 0.5 ? 'rgba(18,18,16,0.34)' : 'rgba(95,92,78,0.26)';
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      // รอยแตกแห้งกร้านทั่วผิวเหมือนดินแตกระแหง
      ctx.strokeStyle = 'rgba(12,12,10,0.5)'; ctx.lineWidth = 1;
      for (let i = 0; i < 75; i++) {
        let x = Math.random() * 256, y = Math.random() * 256;
        ctx.beginPath(); ctx.moveTo(x, y);
        for (let j = 0; j < 4; j++) { x += (Math.random() - 0.5) * 16; y += (Math.random() - 0.5) * 16; ctx.lineTo(x, y); }
        ctx.stroke();
      }
      // จุดคล้ำเน่าตายเป็นหย่อมๆ
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 256, y = Math.random() * 256, r = 4 + Math.random() * 10;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(10,10,8,0.5)');
        g.addColorStop(1, 'rgba(10,10,8,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    }

    // ทำให้ทรงเรียบๆ กลายเป็นก้อนเนื้อบวมนูนไม่เท่ากัน (ใช้ร่วมกับผิวหนังมอนสเตอร์ทุกตัว ลบความรู้สึก "ของเล่นมันวาว")
    function deformFleshGeo(geo, amp) {
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const noise = Math.sin(v.x * 6.5) * Math.cos(v.y * 4.5) * Math.sin(v.z * 5.5);
        const bump = 1 + noise * amp + (Math.random() - 0.5) * amp * 0.5;
        v.multiplyScalar(bump);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
    }

    // สร้าง The Bacteria (เงามนุษย์กิ่งไม้ยักษ์ ขยับแขนขาแบบ 3D Rig)
    function createBacteria3DRig() {
      const rig = new THREE.Group();
      // เปลี่ยนจากสีทึบเรียบ (MeshLambertMaterial สีเดียว) เป็นผิวหนังเน่า/ติดเชื้อแบบมีลาย
      // ใช้ MeshStandardMaterial รับแสงไฟฉายจริง ผิวด้านไม่มันวาว เห็นรายละเอียดชัดตอนเข้าใกล้/โดนแฟลช
      const bacteriaSkinTex = genBacteriaSkinTex();
      const darkMat = new THREE.MeshStandardMaterial({ map: bacteriaSkinTex, color: 0x707a55, roughness: 1.0, metalness: 0 });
      const limbMat = new THREE.MeshStandardMaterial({ map: bacteriaSkinTex, color: 0x5f6a48, roughness: 1.0, metalness: 0 });

      // ลำตัวกระดูกสันหลังบิดเบี้ยว
      bacteriaTorso = new THREE.Group();
      const spineGeo = new THREE.CylinderGeometry(0.12, 0.16, 1.4, 8, 6);
      deformFleshGeo(spineGeo, 0.14); // ผิวบวมนูนไม่เท่ากัน ไม่ใช่ท่อนเรียบ
      const spine = new THREE.Mesh(spineGeo, darkMat);
      bacteriaTorso.add(spine);
      spine.position.y = 0.7;

      // หัวเบี้ยว
      const headGeo = new THREE.SphereGeometry(0.26, 10, 10);
      deformFleshGeo(headGeo, 0.18);
      const head = new THREE.Mesh(headGeo, darkMat);
      head.scale.set(0.9, 1.1, 1.0);
      head.position.y = 1.5;
      bacteriaTorso.add(head);

      // ดวงตาแดงเรืองแสง 2 ดวง ไม่เท่ากัน + ปากเป็นรอยแหว่งแคบยาว ให้เห็นเป็นหน้าจริงๆ เมื่อเข้าใกล้
      const eyeGeo = new THREE.SphereGeometry(0.075, 8, 8);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff2200 });
      const lEye = new THREE.Mesh(eyeGeo, eyeMat);
      lEye.position.set(-0.11, 1.53, 0.22);
      lEye.scale.setScalar(0.9);
      bacteriaTorso.add(lEye);
      const rEye = new THREE.Mesh(eyeGeo, eyeMat);
      rEye.position.set(0.1, 1.56, 0.23);
      rEye.scale.setScalar(1.15);
      bacteriaTorso.add(rEye);

      const mouthMat = new THREE.MeshBasicMaterial({ color: 0x1a0000 });
      const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.035, 0.05), mouthMat);
      mouth.position.set(0, 1.42, 0.23);
      mouth.rotation.z = 0.08;
      bacteriaTorso.add(mouth);
      bacteriaJawMesh = mouth;

      // จุดยึดหน้าจริง (bacteria มีคอยาวมาก หัวอยู่สูงกว่าลำตัวมาก ต้องยึดจากตำแหน่งจริงของตา ไม่ใช่กะจากตัว rig)
      bacteriaFaceAnchor = new THREE.Object3D();
      bacteriaFaceAnchor.position.set(0, 1.48, 0.22);
      bacteriaTorso.add(bacteriaFaceAnchor);

      rig.add(bacteriaTorso);
      bacteriaTorso.position.y = 1.3;

      // แขนซ้าย-ขวา ยาวเก้งก้าง
      const armGeo = new THREE.CylinderGeometry(0.05, 0.04, 1.6, 6, 5);
      deformFleshGeo(armGeo, 0.16);

      bacteriaLeftArm = new THREE.Group();
      const lArmMesh = new THREE.Mesh(armGeo, limbMat);
      lArmMesh.position.y = -0.7;
      bacteriaLeftArm.add(lArmMesh);
      bacteriaLeftArm.position.set(-0.35, 1.3, 0);
      bacteriaTorso.add(bacteriaLeftArm);

      bacteriaRightArm = new THREE.Group();
      const rArmMesh = new THREE.Mesh(armGeo.clone(), limbMat);
      rArmMesh.position.y = -0.7;
      bacteriaRightArm.add(rArmMesh);
      bacteriaRightArm.position.set(0.35, 1.3, 0);
      bacteriaTorso.add(bacteriaRightArm);

      // ขาซ้าย-ขวา สูงโย่ง
      const legGeo = new THREE.CylinderGeometry(0.06, 0.04, 1.5, 6, 5);
      deformFleshGeo(legGeo, 0.16);

      bacteriaLeftLeg = new THREE.Group();
      const lLegMesh = new THREE.Mesh(legGeo, limbMat);
      lLegMesh.position.y = -0.75;
      bacteriaLeftLeg.add(lLegMesh);
      bacteriaLeftLeg.position.set(-0.2, 1.4, 0);
      rig.add(bacteriaLeftLeg);

      bacteriaRightLeg = new THREE.Group();
      const rLegMesh = new THREE.Mesh(legGeo.clone(), limbMat);
      rLegMesh.position.y = -0.75;
      bacteriaRightLeg.add(rLegMesh);
      bacteriaRightLeg.position.set(0.2, 1.4, 0);
      rig.add(bacteriaRightLeg);

      bacteriaLight = new THREE.PointLight(0x440000, 1.4, 8, 2);
      bacteriaLight.position.y = 1.6;
      rig.add(bacteriaLight);

      return rig;
    }

    // สร้าง The Duller (สัตว์ประหลาด 4 ขาคลานติดพื้น)
    function createDuller3DRig() {
      const rig = new THREE.Group();
      // เปลี่ยนจากสีทึบเรียบเป็นผิวหนังซีดแตกระแหงแบบศพเน่า ใช้ MeshStandardMaterial รับแสงไฟฉายจริง
      const dullerSkinTex = genDullerSkinTex();
      const dullMat = new THREE.MeshStandardMaterial({ map: dullerSkinTex, color: 0x9a9a90, roughness: 1.0, metalness: 0 });
      const dullLimbMat = new THREE.MeshStandardMaterial({ map: dullerSkinTex, color: 0x86867c, roughness: 1.0, metalness: 0 });

      const torsoGeo = new THREE.CylinderGeometry(0.22, 0.28, 1.4, 8, 6);
      deformFleshGeo(torsoGeo, 0.14);
      dullerTorso = new THREE.Mesh(torsoGeo, dullMat);
      dullerTorso.rotation.x = Math.PI / 2;
      dullerTorso.position.y = 0.55;
      rig.add(dullerTorso);

      const headGeo = new THREE.SphereGeometry(0.22, 9, 9);
      deformFleshGeo(headGeo, 0.16);
      const head = new THREE.Mesh(headGeo, dullMat);
      head.position.set(0, 0.5, 0.85);
      rig.add(head);

      // ตาขาวซีดไม่มีรูม่านตา (ว่างเปล่า/ไร้ความรู้สึก) + ปากแหว่งอ้ากว้างผิดสัดส่วน ให้มีหน้าที่จำได้เมื่อสบตาใกล้ๆ
      const dullEyeMat = new THREE.MeshBasicMaterial({ color: 0xd8d0c0 });
      const lEye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), dullEyeMat);
      lEye.position.set(-0.09, 0.53, 1.02);
      rig.add(lEye);
      const rEye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), dullEyeMat);
      rEye.position.set(0.09, 0.53, 1.02);
      rig.add(rEye);

      const dullMouthMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      dullerJawMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), dullMouthMat);
      dullerJawMesh.scale.set(1.35, 0.6, 0.5); // ปากกว้างเกินสัดส่วนหน้า ผิดรูปแบบตั้งแต่ยามพัก
      dullerJawMesh.position.set(0, 0.4, 1.0);
      rig.add(dullerJawMesh);

      // จุดยึดหน้าจริง (duller เตี้ยและคลานติดพื้น หัวอยู่ต่ำมาก)
      dullerFaceAnchor = new THREE.Object3D();
      dullerFaceAnchor.position.set(0, 0.48, 0.95);
      rig.add(dullerFaceAnchor);

      // 4 ขาคลาน — ยืดยาวและหักงอเป็นข้อพับแบบแมงมุม (ต้นขากางออกด้านข้าง + หน้าแข้งพับกลับลงพื้น)
      // ยาวและบิดเบี้ยวกว่าท่อนตรงเดิมมาก ให้ความรู้สึกขาผิดรูปน่าขยะแขยงสมกับสัตว์คลาน
      dullerLegs = [];

      const legOffsets = [
        [-0.3, 0.45, 0.5], [0.3, 0.45, 0.5],
        [-0.3, 0.45, -0.5], [0.3, 0.45, -0.5]
      ];

      for (let i = 0; i < 4; i++) {
        const sideSign = legOffsets[i][0] < 0 ? -1 : 1;

        // legGroup คือจุดหมุนสะโพก (แกน x หมุนตอนคลาน — โค้ดอนิเมชันเดิมยังใช้ได้ตรงๆ ไม่ต้องแก้)
        const legGroup = new THREE.Group();

        // ต้นขา: กางออกด้านข้างแรงๆ (หมุนรอบแกน z) ยาวและผอมกว่าเดิมมาก
        const thighGeo = new THREE.CylinderGeometry(0.05, 0.035, 0.58, 6, 4);
        deformFleshGeo(thighGeo, 0.18);
        const thighPivot = new THREE.Group();
        thighPivot.rotation.z = sideSign * 0.55;
        const thighMesh = new THREE.Mesh(thighGeo, dullLimbMat);
        thighMesh.position.y = -0.29;
        thighPivot.add(thighMesh);
        legGroup.add(thighPivot);

        // ข้อพับ (เข่า/ข้อศอกกลับด้าน) อยู่ปลายต้นขาพอดี ให้หน้าแข้งพับกลับลงพื้นแบบขาแมงมุมหัก
        const kneeJoint = new THREE.Group();
        kneeJoint.position.y = -0.58;
        thighPivot.add(kneeJoint);

        const shinPivot = new THREE.Group();
        shinPivot.rotation.z = -sideSign * 1.05;
        kneeJoint.add(shinPivot);

        // หน้าแข้ง: ยาวกว่าต้นขา ปลายเรียวแหลมผอมบิดเบี้ยว
        const shinGeo = new THREE.CylinderGeometry(0.032, 0.012, 0.68, 6, 4);
        deformFleshGeo(shinGeo, 0.2);
        const shinMesh = new THREE.Mesh(shinGeo, dullLimbMat);
        shinMesh.position.y = -0.34;
        shinPivot.add(shinMesh);

        legGroup.position.set(legOffsets[i][0], legOffsets[i][1], legOffsets[i][2]);
        rig.add(legGroup);
        dullerLegs.push(legGroup);
      }

      dullerLight = new THREE.PointLight(0x223322, 1.0, 6, 2);
      dullerLight.position.y = 0.6;
      rig.add(dullerLight);

      return rig;
    }

    // เนื้อผิวหนังเน่าซีด: สีเหลืองหม่นด่างๆ + เส้นเลือดแตก ใช้กับหัว Smiler แทนสีทึบเรียบ
    function genSmilerFleshTex() {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#8f8768'; ctx.fillRect(0, 0, 256, 256);
      // รอยด่างช้ำ/เน่า กระจายไม่สม่ำเสมอ
      for (let i = 0; i < 160; i++) {
        const x = Math.random() * 256, y = Math.random() * 256, r = 3 + Math.random() * 16;
        ctx.fillStyle = Math.random() < 0.5 ? 'rgba(55,45,20,0.28)' : 'rgba(110,35,25,0.20)';
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      // เส้นเลือดฝอยแตกลายงา
      ctx.strokeStyle = 'rgba(95,10,10,0.4)'; ctx.lineWidth = 1;
      for (let i = 0; i < 50; i++) {
        let x = Math.random() * 256, y = Math.random() * 256;
        ctx.beginPath(); ctx.moveTo(x, y);
        for (let j = 0; j < 5; j++) { x += (Math.random() - 0.5) * 22; y += (Math.random() - 0.5) * 22; ctx.lineTo(x, y); }
        ctx.stroke();
      }
      const t = new THREE.CanvasTexture(c);
      return t;
    }

    // สร้าง The Smiler (หัวลอย + ขากรรไกร 3D อ้าหุบได้จริง)
    function createSmiler3DRig() {
      const rig = new THREE.Group();
      const fleshTex = genSmilerFleshTex();
      // เปลี่ยนจาก MeshBasicMaterial (สีทึบเรียบ ไม่รับแสง ดูเป็นของเล่นเรืองแสงเอง) เป็น MeshStandardMaterial
      // ผิวด้าน + texture หนังเน่า ให้รับแสงไฟฉายจริง มีเงาในซอกริ้วรอย ไม่ใช่ก้อนเรียบมันวาว
      const whiteMat = new THREE.MeshStandardMaterial({ map: fleshTex, color: 0xb8a878, roughness: 0.95, metalness: 0 });
      const skullMat = new THREE.MeshStandardMaterial({ map: fleshTex, color: 0x6e6650, roughness: 1.0, metalness: 0 });
      const darkMat = new THREE.MeshBasicMaterial({ color: 0x020202 });
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const veinMat = new THREE.MeshBasicMaterial({ color: 0x5a0000 });
      const voidMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

      // กลุ่มกะโหลกท่อนบน + ดวงตา (ยืดหัวเล็กน้อยให้ดูผิดรูปมากกว่าทรงกลมสวยๆ)
      const headGroup = new THREE.Group();
      const voidBgGeo = new THREE.SphereGeometry(0.82, 20, 20);
      deformFleshGeo(voidBgGeo, 0.16); // ผิวบวมนูนไม่เท่ากัน ไม่ใช่ลูกบอลเรียบ
      const voidBg = new THREE.Mesh(voidBgGeo, skullMat);
      // ยืดหัวเบี้ยวแรงขึ้นกว่าเดิม + เอียงเล็กน้อย ให้ผิดสัดส่วนจากหัวคนมากขึ้น ไม่สมมาตรแบบน่ากลัว
      voidBg.scale.set(0.88, 1.32, 0.96);
      voidBg.rotation.z = 0.06;
      headGroup.add(voidBg);

      // เนื้อเยื่อห้อยจากใต้คาง ลงไปสู่ความมืด — สื่อว่ามีบางอย่างต่ออยู่ข้างล่างที่มองไม่เห็นทั้งตัว
      // (ตัดความรู้สึก "หัวลอยได้เฉยๆ แบบผีการ์ตูน" ออก ให้รู้สึกว่ากำลังมองเห็นแค่ส่วนบนของบางอย่างที่ใหญ่กว่า)
      const stalkGeo = new THREE.CylinderGeometry(0.22, 0.09, 1.6, 8, 4);
      deformFleshGeo(stalkGeo, 0.22);
      const stalkMat = new THREE.MeshStandardMaterial({ map: fleshTex, color: 0x4a4436, roughness: 1.0, transparent: true, opacity: 0.88 });
      const stalk = new THREE.Mesh(stalkGeo, stalkMat);
      stalk.position.set(0, -1.35, -0.05);
      headGroup.add(stalk);
      smilerStalkMesh = stalk;

      // ตาโต 2 ข้าง จมลึกเข้าไปในเบ้ากระดูก (ไม่ใช่โปนออกมาแบบตาการ์ตูน) สีตาเหลืองซีดแบบดีซ่าน
      // รูม่านตาหดเป็นจุดเล็กจิ๋วแบบคนตายไม่โฟกัส + เส้นเลือดแดงฉีกรอบตา
      const eyeGeo = new THREE.SphereGeometry(0.19, 10, 10);
      const pupilGeo = new THREE.SphereGeometry(0.075, 8, 8);
      const veinGeo = new THREE.TorusGeometry(0.2, 0.025, 6, 12);
      const scleraMat = new THREE.MeshStandardMaterial({ color: 0xc9be82, roughness: 0.5 }); // เหลืองซีดแบบดีซ่าน ไม่ใช่ขาวสะอาดแบบตาการ์ตูน
      const socketMat = new THREE.MeshBasicMaterial({ color: 0x0a0805 });

      // เบ้าตาลึกสีดำอยู่หลังลูกตา ให้ตาดูจมมากกว่าโปน
      const lSocket = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), socketMat);
      lSocket.position.set(-0.35, 0.2, 0.7);
      lSocket.scale.set(1.0, 1.2, 0.7);
      const rSocket = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 10), socketMat);
      rSocket.position.set(0.34, 0.22, 0.7);
      rSocket.scale.set(1.3, 0.95, 0.7);
      headGroup.add(lSocket, rSocket);

      const lEye = new THREE.Mesh(eyeGeo, scleraMat);
      lEye.position.set(-0.35, 0.2, 0.72); // ดึงลูกตาถอยเข้าไปในเบ้า (เดิม 0.78 อยู่แนวเดียวกับผิวหน้า ดูโปนเกิน)
      lEye.scale.set(1.0, 1.35, 0.55); // ตาข้างซ้ายยืดเป็นวงรีแนวตั้งผิดปกติ ไม่กลมเหมือนตาคนจริง
      const lPupil = new THREE.Mesh(pupilGeo, pupilMat);
      lPupil.position.set(-0.38, 0.1, 0.8); // รูม่านตาเยื้องต่ำลง เหมือนกำลังจ้องขึ้นตลอดเวลา
      lPupil.scale.setScalar(0.3); // หดเป็นจุดเล็กจิ๋วไร้จุดโฟกัส แทนรูม่านตาโตแบบตกใจ
      const lVein = new THREE.Mesh(veinGeo, veinMat);
      lVein.position.set(-0.35, 0.2, 0.74);

      const rEye = new THREE.Mesh(eyeGeo, scleraMat);
      rEye.position.set(0.34, 0.22, 0.72);
      rEye.scale.set(1.55, 0.85, 0.55); // ตาข้างขวาแบนกว้างผิดสัดส่วนไปอีกทาง ให้สองข้างไม่เท่ากันชัดเจน
      const rPupil = new THREE.Mesh(pupilGeo, pupilMat);
      rPupil.position.set(0.24, 0.19, 0.81);
      rPupil.scale.setScalar(0.35); // หดเป็นจุดเล็กจิ๋วเช่นกัน แต่ไม่เท่าข้างซ้ายเป๊ะ
      const rVein = new THREE.Mesh(veinGeo, veinMat);
      rVein.position.set(0.34, 0.22, 0.74);
      rVein.scale.setScalar(1.2);

      headGroup.add(lEye, lPupil, lVein, rEye, rPupil, rVein);

      // จุดยึดหน้าจริง (อยู่กึ่งกลางตา-ปาก) ให้กล้อง jumpscare เล็งมาตรงนี้เป๊ะๆ แทนการเดาออฟเซ็ตคงที่
      smilerFaceAnchor = new THREE.Object3D();
      smilerFaceAnchor.position.set(0, 0.05, 0.8);
      headGroup.add(smilerFaceAnchor);

      // ช่องปากมืดลึกด้านหลังฟัน (ให้เห็นเป็นโพรงดำลึกตอนอ้าปาก ไม่ใช่แค่ซี่ฟันลอยๆ)
      const mouthVoid = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 10), voidMat);
      mouthVoid.scale.set(1.0, 0.55, 0.5);
      mouthVoid.position.set(0, -0.12, 0.7);
      headGroup.add(mouthVoid);

      // ฟันบน แถวไม่เท่ากัน ทิ่มเอียงสุ่ม ให้ดูแหลมคมไม่เป็นระเบียบ (สีกระดูก/เขี้ยวเหลืองคราบ แยกจากผิวหนัง ไม่ใช่เนื้อเดียวกับหน้า)
      const boneMat = new THREE.MeshStandardMaterial({ color: 0xcfc49a, roughness: 0.6 });
      const toothGeo = new THREE.ConeGeometry(0.045, 0.19, 4);
      toothGeo.rotateX(Math.PI);
      for (let i = -7; i <= 7; i++) {
        const t = new THREE.Mesh(toothGeo, boneMat);
        const jitter = (Math.random() - 0.5) * 0.04;
        t.position.set(i * 0.075, -0.03 + jitter, 0.8 - Math.abs(i) * 0.03);
        t.rotation.z = (Math.random() - 0.5) * 0.5;
        t.rotation.x = (Math.random() - 0.5) * 0.3; // เอียงหน้า-หลังสุ่ม ให้ดูงอกทะลุเหงือกมั่วๆ ไม่เป็นแถว
        t.scale.setScalar(0.75 + Math.random() * 0.7);
        headGroup.add(t);
      }

      rig.add(headGroup);

      // ขากรรไกรล่าง (อ้าหุบได้จริง) ฟันซี่ไม่เท่ากันเช่นกัน
      smilerJawMesh = new THREE.Group();
      const jawToothGeo = new THREE.ConeGeometry(0.04, 0.21, 4);
      for (let i = -7; i <= 7; i++) {
        const t = new THREE.Mesh(jawToothGeo, boneMat);
        const jitter = (Math.random() - 0.5) * 0.04;
        t.position.set(i * 0.065, 0.05 + jitter, 0.78 - Math.abs(i) * 0.03);
        t.rotation.z = (Math.random() - 0.5) * 0.5;
        t.rotation.x = (Math.random() - 0.5) * 0.3;
        t.scale.setScalar(0.75 + Math.random() * 0.7);
        smilerJawMesh.add(t);
      }
      // ปากไม่ปิดสนิทแม้ยามพัก อ้าเป็นรอยยิ้มบางๆ ตลอดเวลา (เดิมปิดสนิทดูเป็นทรงกลมเฉยๆ)
      smilerJawMesh.position.y = -0.16;
      rig.add(smilerJawMesh);

      // เดิมเป็นไฟสีเหลืองนวลสว่างตลอดเวลา (0xfff5cc, 1.8) ทำให้ตัวมันเรืองแสงส่องตัวเองเหมือนโคมไฟ/ของเล่น
      // เปลี่ยนเป็นแสงสีเขียว-เหลืองซีดแบบเนื้อเน่า ความสว่างต่ำ ต้องเอาไฟฉายส่องถึงเห็นชัด ไม่ใช่เรืองแสงเองตลอด
      smilerLight = new THREE.PointLight(0x8a9a4a, 0.55, 7, 2);
      smilerLight.position.set(0, 0, 0.5);
      rig.add(smilerLight);

      rig.position.y = 1.5;
      return rig;
    }

    // ผิวหนัง The Acid Man: เขียวเหลืองบวมพอง เหมือนแผลไหม้จากกรดกัดผิวตัวเอง มีรอยฟองอากาศ/รอยไหม้ดำ
    function genAcidManSkinTex() {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#4d5c1c'; ctx.fillRect(0, 0, 256, 256);
      // คราบเหลือง-เขียวเข้มข้นไม่สม่ำเสมอ เหมือนผิวแช่สารเคมี
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 256, y = Math.random() * 256, r = 3 + Math.random() * 17;
        ctx.fillStyle = Math.random() < 0.5 ? 'rgba(150,170,30,0.30)' : 'rgba(35,45,10,0.35)';
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      // ฟองอากาศ/ตุ่มกัดกร่อนเรืองแสงเขียวอมเหลือง คล้ายผิวกำลังฟู่
      for (let i = 0; i < 70; i++) {
        const x = Math.random() * 256, y = Math.random() * 256, r = 2 + Math.random() * 5;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(210, 230, 90, 0.75)');
        g.addColorStop(0.6, 'rgba(150, 190, 40, 0.35)');
        g.addColorStop(1, 'rgba(150, 190, 40, 0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      // รอยไหม้ดำเป็นหย่อมคล้ายกรดกัดผิวลึกจนไหม้เกรียม
      for (let i = 0; i < 26; i++) {
        const x = Math.random() * 256, y = Math.random() * 256, r = 4 + Math.random() * 9;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(10,8,4,0.6)');
        g.addColorStop(1, 'rgba(10,8,4,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    }

    // สร้าง The Acid Man (มนุษย์เดิน 2 ขา ตัวเตี้ยหนา หลังค่อม แขนยาวหิ้วถังกรดไว้ถ่มใส่ผู้เล่น)
    function createAcidMan3DRig() {
      const rig = new THREE.Group();
      const acidSkinTex = genAcidManSkinTex();
      const bodyMat = new THREE.MeshStandardMaterial({ map: acidSkinTex, color: 0x7c8f3a, roughness: 0.85, metalness: 0 });
      const limbMat = new THREE.MeshStandardMaterial({ map: acidSkinTex, color: 0x6c7d32, roughness: 0.85, metalness: 0 });

      // ลำตัวหนาค่อม
      acidManTorso = new THREE.Group();
      const torsoGeo = new THREE.CylinderGeometry(0.26, 0.34, 1.1, 8, 6);
      deformFleshGeo(torsoGeo, 0.16);
      const torso = new THREE.Mesh(torsoGeo, bodyMat);
      acidManTorso.add(torso);
      torso.position.y = 0.55;
      torso.rotation.x = 0.18; // หลังค่อมงอไปข้างหน้าเล็กน้อย

      // หัวจมคอ เอียงมองต่ำแบบสัตว์นักล่า
      const headGeo = new THREE.SphereGeometry(0.24, 10, 10);
      deformFleshGeo(headGeo, 0.15);
      const head = new THREE.Mesh(headGeo, bodyMat);
      head.scale.set(0.92, 1.0, 1.0);
      head.position.set(0, 1.08, 0.14);
      head.rotation.x = 0.22;
      acidManTorso.add(head);

      // ตาเรืองเขียวพิษ 2 ดวง + ปากแหว่งหยดกรดตลอดเวลา
      const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x9bff33 });
      const lEye = new THREE.Mesh(eyeGeo, eyeMat);
      lEye.position.set(-0.09, 1.1, 0.32);
      acidManTorso.add(lEye);
      const rEye = new THREE.Mesh(eyeGeo, eyeMat);
      rEye.position.set(0.09, 1.11, 0.33);
      acidManTorso.add(rEye);

      const jawMat = new THREE.MeshBasicMaterial({ color: 0x0d1400 });
      acidManJawMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.06), jawMat);
      acidManJawMesh.position.set(0, 0.98, 0.34);
      acidManTorso.add(acidManJawMesh);

      acidManFaceAnchor = new THREE.Object3D();
      acidManFaceAnchor.position.set(0, 1.04, 0.32);
      acidManTorso.add(acidManFaceAnchor);

      rig.add(acidManTorso);
      acidManTorso.position.y = 1.0;

      // แขนสั้นหนา ปลายมือบวมพอง (มือที่ถ่มกรดออกมา)
      const armGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.85, 6, 5);
      deformFleshGeo(armGeo, 0.14);
      const handGeo = new THREE.SphereGeometry(0.1, 8, 8);
      deformFleshGeo(handGeo, 0.22);

      acidManLeftArm = new THREE.Group();
      const lArmMesh = new THREE.Mesh(armGeo, limbMat);
      lArmMesh.position.y = -0.4;
      acidManLeftArm.add(lArmMesh);
      const lHand = new THREE.Mesh(handGeo, limbMat);
      lHand.position.y = -0.82;
      acidManLeftArm.add(lHand);
      acidManLeftArm.position.set(-0.32, 1.55, 0.05);
      rig.add(acidManLeftArm);

      acidManRightArm = new THREE.Group();
      const rArmMesh = new THREE.Mesh(armGeo.clone(), limbMat);
      rArmMesh.position.y = -0.4;
      acidManRightArm.add(rArmMesh);
      const rHand = new THREE.Mesh(handGeo.clone(), limbMat);
      rHand.position.y = -0.82;
      acidManRightArm.add(rHand);
      acidManRightArm.position.set(0.32, 1.55, 0.05);
      rig.add(acidManRightArm);

      // ขาสั้นหนา
      const legGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.85, 6, 5);
      deformFleshGeo(legGeo, 0.13);

      acidManLeftLeg = new THREE.Group();
      const lLegMesh = new THREE.Mesh(legGeo, limbMat);
      lLegMesh.position.y = -0.42;
      acidManLeftLeg.add(lLegMesh);
      acidManLeftLeg.position.set(-0.16, 0.85, 0);
      rig.add(acidManLeftLeg);

      acidManRightLeg = new THREE.Group();
      const rLegMesh = new THREE.Mesh(legGeo.clone(), limbMat);
      rLegMesh.position.y = -0.42;
      acidManRightLeg.add(rLegMesh);
      acidManRightLeg.position.set(0.16, 0.85, 0);
      rig.add(acidManRightLeg);

      acidManLight = new THREE.PointLight(0x8fdb1f, 1.1, 7, 2);
      acidManLight.position.y = 1.2;
      rig.add(acidManLight);

      return rig;
    }



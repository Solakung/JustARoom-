    // -------------------------------------------------------------
    // 2. Sound Engine (นีออนหึ่งอื้ออึง + เสียงชีววิทยา)
    // -------------------------------------------------------------
    window.initAudioContextSafely = function() {
      try {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioClass) return;
        if (!audioCtx) audioCtx = new AudioClass();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        if (!humGain) {
          const h1 = audioCtx.createOscillator();
          const h2 = audioCtx.createOscillator();
          const h3 = audioCtx.createOscillator();
          h1.type = 'sawtooth'; h1.frequency.value = 60;
          h2.type = 'sine'; h2.frequency.value = 120;
          h3.type = 'sawtooth'; h3.frequency.value = 180;

          const f = audioCtx.createBiquadFilter();
          f.type = 'lowpass'; f.frequency.value = 240;

          humGain = audioCtx.createGain();
          humGain.gain.value = 0.18; // เสียงนีออนหึ่งอื้ออึง

          h1.connect(f); h2.connect(f); h3.connect(f);
          f.connect(humGain); humGain.connect(audioCtx.destination);
          h1.start(); h2.start(); h3.start();

          // 1. Smiler
          monsterOsc1 = audioCtx.createOscillator();
          monsterOsc2 = audioCtx.createOscillator();
          monsterOsc1.type = 'sawtooth'; monsterOsc1.frequency.value = 90;
          monsterOsc2.type = 'sawtooth'; monsterOsc2.frequency.value = 94;
          const mf = audioCtx.createBiquadFilter();
          mf.type = 'bandpass'; mf.frequency.value = 450; mf.Q.value = 3.5;
          monsterSoundGain = audioCtx.createGain();
          monsterSoundGain.gain.value = 0.0001;
          monsterOsc1.connect(mf); monsterOsc2.connect(mf);
          mf.connect(monsterSoundGain); monsterSoundGain.connect(audioCtx.destination);
          monsterOsc1.start(); monsterOsc2.start();

          // 2. The Bacteria (เสียงขูดและเสียงโลหะลาก)
          shadowOsc = audioCtx.createOscillator();
          shadowOsc.type = 'sawtooth'; shadowOsc.frequency.value = 36;
          const sf = audioCtx.createBiquadFilter();
          sf.type = 'lowpass'; sf.frequency.value = 90;
          shadowSoundGain = audioCtx.createGain();
          shadowSoundGain.gain.value = 0.0001;
          shadowOsc.connect(sf); sf.connect(shadowSoundGain);
          shadowSoundGain.connect(audioCtx.destination);
          shadowOsc.start();

          // 3. The Duller (เสียงซอยเท้าคลาน)
          dullerOsc = audioCtx.createOscillator();
          dullerOsc.type = 'triangle'; dullerOsc.frequency.value = 140;
          const df = audioCtx.createBiquadFilter();
          df.type = 'bandpass'; df.frequency.value = 280; df.Q.value = 4.0;
          dullerSoundGain = audioCtx.createGain();
          dullerSoundGain.gain.value = 0.0001;
          dullerOsc.connect(df); df.connect(dullerSoundGain);
          dullerSoundGain.connect(audioCtx.destination);
          dullerOsc.start();

          // 4. The Acid Man (เสียงฟู่กัดกร่อนต่ำๆ ตลอดเวลาที่มันไล่ล่า)
          acidOsc = audioCtx.createOscillator();
          acidOsc.type = 'sawtooth'; acidOsc.frequency.value = 100;
          const af = audioCtx.createBiquadFilter();
          af.type = 'bandpass'; af.frequency.value = 500; af.Q.value = 2.2;
          acidSoundGain = audioCtx.createGain();
          acidSoundGain.gain.value = 0.0001;
          acidOsc.connect(af); af.connect(acidSoundGain);
          acidSoundGain.connect(audioCtx.destination);
          acidOsc.start();
        }
      } catch (err) {}
    };

    window.addEventListener('pointerdown', () => {
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    });

    function playFootstep() {
      if (!audioCtx || audioCtx.state !== 'running') return;
      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(75, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.1);
        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.11);
      } catch(e) {}
    }

    function playHeartbeat(volume = 0.2) {
      if (!audioCtx || audioCtx.state !== 'running') return;
      try {
        const now = audioCtx.currentTime;
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(95, now);
        osc1.frequency.exponentialRampToValueAtTime(35, now + 0.09);
        gain1.gain.setValueAtTime(volume, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc1.connect(gain1); gain1.connect(audioCtx.destination);
        osc1.start(now); osc1.stop(now + 0.13);

        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(80, now + 0.18);
        osc2.frequency.exponentialRampToValueAtTime(30, now + 0.27);
        gain2.gain.setValueAtTime(volume * 0.75, now + 0.18);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc2.connect(gain2); gain2.connect(audioCtx.destination);
        osc2.start(now + 0.18); osc2.stop(now + 0.31);
      } catch(e) {}
    }

    function playDrinkSound() {
      if (!audioCtx || audioCtx.state !== 'running') return;
      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.25);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.35);
      } catch(e) {}
    }

    function playSprintSound() {
      if (!audioCtx || audioCtx.state !== 'running') return;
      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.28);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.32);
      } catch(e) {}
    }

    function playGlitchShiftSound() {
      if (!audioCtx || audioCtx.state !== 'running') return;
      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.35);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.42);
      } catch(e) {}
    }

    // เสียง "ถุ๊ย" ตอน Acid Man ถ่มกรดออกจากปาก — เสียงเปียกๆ สั้นๆ ความถี่ตก
    function playAcidSpitSound() {
      if (!audioCtx || audioCtx.state !== 'running') return;
      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.2);
      } catch(e) {}
    }

    // เสียง "ฟู่ซ่า" ตอนก้อนกรดกระทบตัวผู้เล่น — เสียงนอยส์กรองความถี่สูงแทนเสียงกัดกร่อน
    function playAcidSizzleSound() {
      if (!audioCtx || audioCtx.state !== 'running') return;
      try {
        const now = audioCtx.currentTime;
        const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.4, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const hf = audioCtx.createBiquadFilter();
        hf.type = 'highpass'; hf.frequency.value = 1800;
        const nGain = audioCtx.createGain();
        nGain.gain.setValueAtTime(0.35, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        noise.connect(hf); hf.connect(nGain); nGain.connect(audioCtx.destination);
        noise.start(now);

        const thud = audioCtx.createOscillator();
        const thudGain = audioCtx.createGain();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(90, now);
        thud.frequency.exponentialRampToValueAtTime(35, now + 0.2);
        thudGain.gain.setValueAtTime(0.3, now);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        thud.connect(thudGain); thudGain.connect(audioCtx.destination);
        thud.start(now); thud.stop(now + 0.26);
      } catch(e) {}
    }

    function playViolentJumpscareSound() {
      if (!audioCtx || audioCtx.state !== 'running') return;
      try {
        const now = audioCtx.currentTime;

        const sub = audioCtx.createOscillator();
        const subG = audioCtx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(150, now);
        sub.frequency.exponentialRampToValueAtTime(20, now + 0.9);
        subG.gain.setValueAtTime(0.7, now);
        subG.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
        sub.connect(subG); subG.connect(audioCtx.destination);
        sub.start(now); sub.stop(now + 1.0);

        const sc1 = audioCtx.createOscillator();
        const sc2 = audioCtx.createOscillator();
        const scGain = audioCtx.createGain();
        sc1.type = 'sawtooth'; sc1.frequency.setValueAtTime(780, now);
        sc2.type = 'sawtooth'; sc2.frequency.setValueAtTime(840, now);
        scGain.gain.setValueAtTime(0.45, now);
        scGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
        sc1.connect(scGain); sc2.connect(scGain);
        scGain.connect(audioCtx.destination);
        sc1.start(now); sc2.start(now);
        sc1.stop(now + 0.8); sc2.stop(now + 0.8);

        const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.7, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.55;
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.connect(audioCtx.destination);
        noise.start(now);

        // เสียงกรีดร้องบิดเบี้ยว (pitch สวิงขึ้นเร็วแล้วร่วงลง) ผ่าน WaveShaper ให้แตกพร่าฟังแล้วขนลุกกว่าเสียง synth เพียวๆ
        const shriek = audioCtx.createOscillator();
        shriek.type = 'sawtooth';
        shriek.frequency.setValueAtTime(320, now);
        shriek.frequency.exponentialRampToValueAtTime(1500, now + 0.12);
        shriek.frequency.exponentialRampToValueAtTime(180, now + 0.85);
        const shaper = audioCtx.createWaveShaper();
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
          const x = (i / 255) * 2 - 1;
          curve[i] = Math.tanh(x * 6); // บิดคลื่นให้แตกพร่า (distortion)
        }
        shaper.curve = curve;
        const shriekGain = audioCtx.createGain();
        shriekGain.gain.setValueAtTime(0.001, now);
        shriekGain.gain.linearRampToValueAtTime(0.5, now + 0.06);
        shriekGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
        shriek.connect(shaper); shaper.connect(shriekGain); shriekGain.connect(audioCtx.destination);
        shriek.start(now); shriek.stop(now + 1.05);
      } catch(e) {}
    }

    // เสียงหึ่งความถี่ต่ำแบบ "liminal space" เปิดครั้งเดียวตอนไฟดับครั้งแรก แล้วค่อยๆ ไล่ระดับขึ้นแผ่วๆ
    // ผสมกับเสียงนีออนหึ่งเดิม (humGain) ให้บรรยากาศรู้สึกอึดอัด/ผิดที่ผิดทางกว่าตอนเป็นออฟฟิศปกติ
    function startLiminalHum() {
      try {
        if (liminalHumStarted || !audioCtx) return;
        liminalHumStarted = true;
        liminalHumOsc = audioCtx.createOscillator();
        liminalHumOsc.type = 'sine';
        liminalHumOsc.frequency.value = 48;
        const lf = audioCtx.createBiquadFilter();
        lf.type = 'lowpass'; lf.frequency.value = 120;
        liminalHumGain = audioCtx.createGain();
        liminalHumGain.gain.value = 0.0001;
        liminalHumOsc.connect(lf); lf.connect(liminalHumGain); liminalHumGain.connect(audioCtx.destination);
        liminalHumOsc.start();
        liminalHumGain.gain.linearRampToValueAtTime(0.10, audioCtx.currentTime + 4);
      } catch (e) {}
    }


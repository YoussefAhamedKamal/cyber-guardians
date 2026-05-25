# Cyber Guardians — PROJECT MAP

> لعبة تعليمية تفاعلية ثلاثية الأبعاد لتعليم أساسيات الأمن السيبراني للمراهقين
> الحالة: **✅ إنتاج (Production-Ready)**

---

## [TECH_STACK]

| الطبقة | التقنية | الإصدار | الغرض |
|---|---|---|---|
| Build | Vite | 8.0.14 | Bundler / Dev server |
| Language | TypeScript | 6.0.3 | Strict typing |
| UI Framework | React | 19.x | UI / HUD / Menus |
| 3D Engine | Three.js | 0.184.0 | WebGL rendering |
| React → Three | @react-three/fiber | 9.6.1 | R3F renderer |
| 3D Helpers | @react-three/drei | 10.7.7 | Utility components |
| State | Zustand | 5.0.13 | Game + Settings store |
| Audio | Web Audio API (Procedural) | — | BGM + SFX 🔊 مربوط بكل التحديات |
| 3D Characters | useGLTF (RobotExpressive) + Float + useAnimations | — | نماذج محملة من الإنترنت مع حركات |
| 3D Environment | Stars + Particles + Grid | — | خلفية نجمية مع جزيئات عائمة |
| Testing | Vitest | 4.1.7 | 34 اختبار ✅ |

### قيود تقنية
- Strict TypeScript (noImplicitAny, strictNullChecks, exactOptionalPropertyTypes)
- ES2022 target
- Path aliases: `@/` → `src/`
- Resolution: responsive 16:9 (base 1200×675)
- Chunk size: ~1.2MB (Three.js + GLTF)

---

## [SYSTEM_FLOW]

```
[Boot]
  │
  ├─→ Main Menu ←────────────────────────────┐
  │     ├─→ New Game → Level 1               │
  │     ├─→ Continue → Level Select          │
  │     └─→ Settings                         │
  │                                          │
  ├─→ Level Select                           │
  │     └─→ Level[N]                         │
  │           ├─→ Story Dialogue (3D scene)  │
  │           ├─→ Challenge (mini-game)      │
  │           ├─→ Result → Outro Dialogue    │
  │           └─→ Back to Level Select ──────┘
  │
  ├─→ Settings (sound, quality, a11y)
  │
  └─→ Victory (عند إكمال 7 مستويات)
       → Reset → Main Menu
```

---

## [LEVEL MAP]

| # | الاسم | الثغرة | التحدي | عدد الأسئلة/الخطوات |
|---|---|---|---|---|
| 1 | رسالة مشبوهة | Phishing | بطاقات تصنيف إيميلات | 6 إيميلات |
| 2 | الباب المفتوح | Password | بناء كلمة مرور بالمعايير | 4 قواعد |
| 3 | الضيف غير المرغوب | Malware | متاهة تعقب وعزل | 5×5 Grid |
| 4 | الثغرة في الجدار | Network | إعداد جدار ناري | 6 منافذ |
| 5 | الرسالة المشفرة | Encryption | Caesar Cipher | Shift 1-10 |
| 6 | الموقع المخترق | Web Security | إصلاح كود (SQLi + XSS) | 2 قطع كود |
| 7 | الهجوم الأخير | Incident Response | اختيار متعدد | 3 خطوات |

---

## [ARCHITECTURE]

```
src/
├── App.tsx                          # 6 شاشات (menu, levelSelect, dialogue, gameplay, settings, victory)
├── main.tsx                         # Entry point
│
├── challenges/                      # 7 mini-games كاملة
│   ├── ChallengeRenderer.tsx        # Router حسب type
│   ├── CardChallenge.tsx            # Level 1
│   ├── BuildChallenge.tsx           # Level 2
│   ├── MazeChallenge.tsx            # Level 3
│   ├── DragDropChallenge.tsx        # Level 4
│   ├── DecryptChallenge.tsx         # Level 5
│   ├── CodeFixChallenge.tsx         # Level 6
│   └── ResponseChallenge.tsx        # Level 7
│
├── components/
│   ├── ui/                          # Button, Modal, ProgressBar, DialogueBox 🔊 صوت نقر
│   └── three/                       # GameCanvas, CharacterModel (GLTF+Anim), Environment (Stars+Particles)
│
├── store/                           # gameStore + settingsStore (Zustand + persist)
├── systems/                         # AudioSystem, LoggingSystem, ProceduralAudio 🔊
├── hooks/                           # useResponsive
├── data/                            # characters + dialogue (7 levels with story)
├── types/                           # TypeScript interfaces
├── utils/                           # constants, storage, helpers
└── __tests__/                       # 34 اختبارات
    ├── gameStore.test.ts            # 9 tests
    ├── settingsStore.test.ts        # 6 tests
    ├── storage.test.ts              # 5 tests
    ├── helpers.test.ts              # 6 tests
    ├── logging.test.ts              # 5 tests
    └── levels.test.ts               # 3 tests
```

---

## [SETTINGS]

| الميزة | الحالة | التنفيذ |
|---|---|---|
| Volume BGM | ✅ | Store + input range |
| Volume SFX | ✅ | Store + input range |
| Quality Preset | ✅ | low/medium/high يتحكم dpr, shadows, antialias |
| Font Size | ✅ | Accessibility |
| Accessibility Mode | ✅ | toggle |
| Reset Defaults | ✅ | localStorage clear |
| Auto-save last used | ✅ | Zustand persist middleware |

---

## [ORPHANS & PENDING]

- [ ] **نموذج GLTF مخصص لكل شخصية** — حالياً نموذج واحد (RobotExpressive) بألوان مختلفة
- [ ] **ملفات صوتية احترافية** — حالياً توليد صوتي (oscillator)؛ يُفضل BGM و SFX مسجلة
- [ ] **صفحة Credits** — بسيطة يمكن إضافتها
- [ ] **تلميحات داخل التحديات** — للمستخدمين الجدد
- [ ] **ترجمة إنجليزية** — MVP عربي بالكامل
- [ ] **Deployment** — GitHub Pages / Vercel / Netlify

// Normalize whatever the backend stores ("English", "en", "Spanish", "es", …)
export function normalizeLang(raw) {
  if (!raw) return 'en'
  const map = {
    english: 'en', spanish: 'es', french: 'fr',
    mandarin: 'zh', chinese: 'zh', arabic: 'ar',
    portuguese: 'pt', german: 'de', japanese: 'ja',
    korean: 'ko', hindi: 'hi',
  }
  const lower = raw.toLowerCase()
  return map[lower] ?? lower
}

const T = {
  // ── Navigation / actions ──────────────────────────────────────────────────
  sign_in:        { en: 'Sign in',        es: 'Iniciar sesión',     fr: 'Se connecter',     zh: '登录',       ar: 'تسجيل الدخول' },
  sign_out:       { en: 'Sign out',       es: 'Cerrar sesión',      fr: 'Se déconnecter',   zh: '退出登录',    ar: 'تسجيل الخروج' },
  get_started:    { en: 'Get started',    es: 'Comenzar',           fr: 'Commencer',        zh: '开始使用',    ar: 'ابدأ الآن' },
  continue:       { en: 'Continue',       es: 'Continuar',          fr: 'Continuer',        zh: '继续',       ar: 'متابعة' },
  back:           { en: '← Back',         es: '← Atrás',           fr: '← Retour',         zh: '← 返回',    ar: '← رجوع' },
  go_home:        { en: 'Go home',        es: 'Ir al inicio',       fr: "Retour à l'accueil", zh: '返回首页',  ar: 'الصفحة الرئيسية' },
  download:       { en: 'Download',       es: 'Descargar',          fr: 'Télécharger',      zh: '下载',       ar: 'تنزيل' },
  download_json:  { en: 'Download JSON',  es: 'Descargar JSON',     fr: 'Télécharger JSON', zh: '下载 JSON',  ar: 'تنزيل JSON' },

  // ── Auth ─────────────────────────────────────────────────────────────────
  sign_in_subtitle:    { en: 'Sign in to your account',   es: 'Inicia sesión en tu cuenta',    fr: 'Connectez-vous à votre compte',   zh: '登录您的账户',   ar: 'سجّل دخولك إلى حسابك' },
  create_account:      { en: 'Create account',            es: 'Crear cuenta',                  fr: 'Créer un compte',                 zh: '创建账户',       ar: 'إنشاء حساب' },
  create_account_sub:  { en: 'Create your account',       es: 'Crea tu cuenta',                fr: 'Créez votre compte',              zh: '创建您的账户',   ar: 'أنشئ حسابك' },
  email:               { en: 'Email',                     es: 'Correo electrónico',            fr: 'E-mail',                          zh: '电子邮件',       ar: 'البريد الإلكتروني' },
  password:            { en: 'Password',                  es: 'Contraseña',                    fr: 'Mot de passe',                    zh: '密码',           ar: 'كلمة المرور' },
  full_name:           { en: 'Full name',                 es: 'Nombre completo',               fr: 'Nom complet',                     zh: '全名',           ar: 'الاسم الكامل' },
  phone_number:        { en: 'Phone number',              es: 'Número de teléfono',            fr: 'Numéro de téléphone',             zh: '电话号码',       ar: 'رقم الهاتف' },
  phone_hint:          { en: 'Include country code, e.g. +1', es: 'Incluye el código de país, p. ej. +1', fr: 'Incluez l\'indicatif, ex. +1', zh: '请包含国家代码，如 +1', ar: 'أدرج رمز الدولة، مثل +1' },
  recovery_email:      { en: 'Recovery email',            es: 'Correo de recuperación',        fr: 'E-mail de récupération',          zh: '恢复邮箱',       ar: 'بريد الاسترداد' },
  optional:            { en: '(optional)',                es: '(opcional)',                    fr: '(facultatif)',                    zh: '（可选）',       ar: '(اختياري)' },
  preferred_language:  { en: 'Preferred language',        es: 'Idioma preferido',              fr: 'Langue préférée',                 zh: '首选语言',       ar: 'اللغة المفضلة' },
  signing_in:          { en: 'Signing in…',               es: 'Iniciando sesión…',             fr: 'Connexion…',                      zh: '登录中…',        ar: 'جار تسجيل الدخول…' },
  sending_code:        { en: 'Sending code…',             es: 'Enviando código…',              fr: 'Envoi du code…',                  zh: '发送验证码…',    ar: 'جار إرسال الرمز…' },
  verifying:           { en: 'Verifying…',                es: 'Verificando…',                  fr: 'Vérification…',                   zh: '验证中…',        ar: 'جار التحقق…' },
  verify_create:       { en: 'Verify & create account',  es: 'Verificar y crear cuenta',      fr: 'Vérifier et créer le compte',     zh: '验证并创建账户', ar: 'تحقق وأنشئ الحساب' },
  no_account:          { en: "Don't have an account?",   es: '¿No tienes cuenta?',            fr: 'Pas de compte ?',                 zh: '没有账户？',     ar: 'ليس لديك حساب؟' },
  have_account:        { en: 'Already have an account?', es: '¿Ya tienes cuenta?',            fr: 'Vous avez déjà un compte ?',      zh: '已有账户？',     ar: 'هل لديك حساب بالفعل؟' },
  create_one:          { en: 'Create one',               es: 'Crear una',                     fr: 'En créer un',                     zh: '创建一个',       ar: 'إنشاء حساب' },
  account_created:     { en: 'Account created! Sign in to continue.', es: '¡Cuenta creada! Inicia sesión para continuar.', fr: 'Compte créé ! Connectez-vous pour continuer.', zh: '账户已创建！请登录继续。', ar: 'تم إنشاء الحساب! سجّل دخولك للمتابعة.' },

  // ── Verification ──────────────────────────────────────────────────────────
  code_sent_to:       { en: 'We sent a 6-digit code to',          es: 'Enviamos un código de 6 dígitos a',   fr: 'Nous avons envoyé un code à 6 chiffres à', zh: '我们已向以下地址发送了6位验证码',  ar: 'أرسلنا رمزًا من 6 أرقام إلى' },
  code_delay:         { en: 'The code may take 30 seconds to arrive. Please be patient.', es: 'El código puede tardar 30 segundos. Por favor, sé paciente.', fr: 'Le code peut prendre 30 secondes. Soyez patient.', zh: '验证码最多需要30秒到达，请耐心等待。', ar: 'قد يستغرق وصول الرمز 30 ثانية. يُرجى الانتظار.' },
  verification_code:  { en: 'Verification code',                   es: 'Código de verificación',              fr: 'Code de vérification',                     zh: '验证码',                              ar: 'رمز التحقق' },

  // ── Profile ───────────────────────────────────────────────────────────────
  loading_profile:  { en: 'Loading your profile…',  es: 'Cargando tu perfil…',      fr: 'Chargement du profil…',   zh: '加载个人资料…',    ar: 'جار تحميل ملفك الشخصي…' },
  university:       { en: 'University',             es: 'Universidad',              fr: 'Université',              zh: '大学',             ar: 'الجامعة' },
  school_code:      { en: 'School code',            es: 'Código de la escuela',     fr: 'Code école',              zh: '学校代码',         ar: 'رمز المدرسة' },
  account_id:       { en: 'Account ID',             es: 'ID de cuenta',             fr: 'ID de compte',            zh: '账户 ID',          ar: 'معرّف الحساب' },
  my_documents:     { en: 'My documents',           es: 'Mis documentos',           fr: 'Mes documents',           zh: '我的文档',         ar: 'مستنداتي' },

  // ── Contract gallery ──────────────────────────────────────────────────────
  no_documents:     { en: 'No documents yet.',          es: 'Aún no hay documentos.',         fr: 'Aucun document.',                 zh: '暂无文档。',          ar: 'لا توجد مستندات بعد.' },
  upload_first:     { en: 'Upload your first PDF',      es: 'Sube tu primer PDF',             fr: 'Téléversez votre premier PDF',    zh: '上传您的第一个 PDF',   ar: 'ارفع ملف PDF الأول' },
  upload_pdf:       { en: '+ Upload PDF',               es: '+ Subir PDF',                    fr: '+ Téléverser un PDF',             zh: '+ 上传 PDF',          ar: '+ رفع PDF' },
  profile:          { en: 'Profile',                    es: 'Perfil',                         fr: 'Profil',                          zh: '个人资料',            ar: 'الملف الشخصي' },
  hover_tooltips:   { en: 'Hover tooltips',             es: 'Mostrar pistas',                 fr: 'Infobulles',                      zh: '悬停提示',            ar: 'تلميحات التمرير' },
  analysis:         { en: 'Analysis',                   es: 'Análisis',                       fr: 'Analyse',                         zh: '分析',                ar: 'التحليل' },
  raw_json:         { en: 'Raw JSON',                   es: 'JSON sin procesar',              fr: 'JSON brut',                       zh: '原始 JSON',           ar: 'JSON الخام' },

  // ── Contract upload ───────────────────────────────────────────────────────
  parse_contract:  { en: 'Parse Contract PDF',   es: 'Analizar PDF del contrato',  fr: 'Analyser le PDF du contrat',  zh: '解析合同 PDF',   ar: 'تحليل ملف PDF للعقد' },
  pdf_file:        { en: 'PDF file',             es: 'Archivo PDF',                fr: 'Fichier PDF',                 zh: 'PDF 文件',       ar: 'ملف PDF' },
  upload_parse:    { en: 'Upload & Parse',       es: 'Subir y analizar',           fr: 'Téléverser et analyser',      zh: '上传并解析',     ar: 'رفع وتحليل' },
  parsing:         { en: 'Parsing…',             es: 'Analizando…',                fr: 'Analyse…',                    zh: '解析中…',        ar: 'جار التحليل…' },
  extracted_text:  { en: 'Extracted text',       es: 'Texto extraído',             fr: 'Texte extrait',               zh: '提取的文本',     ar: 'النص المستخرج' },

  // ── Analysis panel ────────────────────────────────────────────────────────
  eta_min:         { en: '~{n} min to fill',     es: '~{n} min para rellenar',     fr: '~{n} min à remplir',          zh: '约 {n} 分钟填写', ar: '~{n} دقيقة للملء' },
  before_begin:    { en: 'Before you begin',     es: 'Antes de empezar',           fr: 'Avant de commencer',          zh: '开始之前',       ar: 'قبل البدء' },
  steps:           { en: 'Steps',                es: 'Pasos',                      fr: 'Étapes',                      zh: '步骤',           ar: 'الخطوات' },
  notes:           { en: 'Notes',                es: 'Notas',                      fr: 'Notes',                       zh: '注释',           ar: 'ملاحظات' },
  page:            { en: 'Page',                 es: 'Página',                     fr: 'Page',                        zh: '第',             ar: 'الصفحة' },

  // ── Home ──────────────────────────────────────────────────────────────────
  wip_banner:      { en: 'Web version — work in progress. The full FormFriend experience is on iOS.', es: 'Versión web en desarrollo. La experiencia completa está en iOS.', fr: 'Version web en développement. L\'expérience complète est sur iOS.', zh: '网页版本正在开发中。完整体验请使用 iOS 应用。', ar: 'الإصدار الويب قيد التطوير. التجربة الكاملة على iOS.' },
  ios_badge:       { en: 'Primary app on iOS — web preview available', es: 'App principal en iOS — vista previa web disponible', fr: 'App principale sur iOS — aperçu web disponible', zh: '主应用在 iOS 上 — 网页预览可用', ar: 'التطبيق الأساسي على iOS — معاينة الويب متاحة' },
  hero_line1:      { en: 'Navigate any document,', es: 'Navega cualquier documento,', fr: 'Naviguez dans n\'importe quel document,', zh: '导航任何文档，', ar: 'تصفّح أي مستند،' },
  hero_line2:      { en: 'step by step.', es: 'paso a paso.', fr: 'étape par étape.', zh: '逐步完成。', ar: 'خطوة بخطوة.' },
  hero_sub:        { en: 'FormFriend uses AI and OCR to guide you through complex forms — highlighting exactly where to sign, what to fill, and what to prepare.', es: 'FormFriend usa IA y OCR para guiarte en formularios complejos, resaltando dónde firmar, qué rellenar y qué preparar.', fr: "FormFriend utilise l'IA et l'OCR pour vous guider — indiquant où signer, quoi remplir et quoi préparer.", zh: 'FormFriend 使用 AI 和 OCR 引导您完成复杂表格，精确标注签名位置、填写内容及所需准备。', ar: 'يستخدم FormFriend الذكاء الاصطناعي والتعرف الضوئي لإرشادك خلال النماذج المعقدة.' },
  try_preview:     { en: 'Try the web preview', es: 'Probar la versión web', fr: 'Essayer la version web', zh: '试用网页预览', ar: 'جرّب معاينة الويب' },
  ios_feat_title:  { en: 'iOS App — Core Features', es: 'App iOS — Funciones principales', fr: 'App iOS — Fonctionnalités principales', zh: 'iOS 应用 — 核心功能', ar: 'تطبيق iOS — الميزات الأساسية' },
  feat_scan:       { en: 'Scan any document',      es: 'Escanea cualquier documento', fr: 'Scannez n\'importe quel document', zh: '扫描任何文档', ar: 'امسح أي مستند ضوئيًا' },
  feat_scan_sub:   { en: 'Capture multi-page forms with your camera. No scanner needed.', es: 'Captura formularios de varias páginas con tu cámara. Sin escáner.', fr: 'Capturez des formulaires multi-pages avec votre appareil. Sans scanner.', zh: '用摄像头拍摄多页表格，无需扫描仪。', ar: 'التقط نماذج متعددة الصفحات بكاميرتك. لا حاجة لماسح ضوئي.' },
  feat_ocr:        { en: 'AI-powered OCR',         es: 'OCR con inteligencia artificial', fr: 'OCR par IA', zh: 'AI 驱动的 OCR', ar: 'تعرف ضوئي بالذكاء الاصطناعي' },
  feat_ocr_sub:    { en: 'AWS Textract extracts every field with precise bounding boxes for live highlighting.', es: 'AWS Textract extrae cada campo con cuadros delimitadores precisos.', fr: 'AWS Textract extrait chaque champ avec des zones précises pour la mise en évidence.', zh: 'AWS Textract 精确提取每个字段，实现实时高亮显示。', ar: 'يستخرج AWS Textract كل حقل بصناديق تحديد دقيقة للإبراز الفوري.' },
  feat_guide:      { en: 'Step-by-step guidance',  es: 'Guía paso a paso', fr: 'Guidage étape par étape', zh: '逐步引导', ar: 'إرشاد خطوة بخطوة' },
  feat_guide_sub:  { en: 'Each field is highlighted in the PDF in order, with clear instructions for what to write.', es: 'Cada campo se resalta en orden en el PDF con instrucciones claras.', fr: 'Chaque champ est mis en évidence dans le PDF avec des instructions claires.', zh: '每个字段按顺序在 PDF 中高亮显示，并附有清晰的填写说明。', ar: 'يتم تمييز كل حقل بالترتيب في PDF مع تعليمات واضحة.' },
  feat_lang:       { en: 'Multilingual',            es: 'Multilingüe', fr: 'Multilingue', zh: '多语言支持', ar: 'متعدد اللغات' },
  feat_lang_sub:   { en: 'Full guidance in English, Spanish, French, Mandarin, and Arabic.', es: 'Guía completa en inglés, español, francés, mandarín y árabe.', fr: 'Guidage complet en anglais, espagnol, français, mandarin et arabe.', zh: '完整支持英语、西班牙语、法语、普通话和阿拉伯语。', ar: 'إرشاد كامل بالإنجليزية والإسبانية والفرنسية والماندرين والعربية.' },
  about_web_title: { en: 'About this web version', es: 'Sobre la versión web', fr: 'À propos de la version web', zh: '关于此网页版本', ar: 'حول هذا الإصدار الويب' },
  about_web_body:  { en: "This web interface lets you upload PDFs, run AI analysis, and review guided results from any browser. It's a work in progress — the full guided overlay, live camera scanning, and offline support are in the iOS app.", es: 'Esta interfaz web te permite subir PDFs, ejecutar análisis de IA y revisar resultados guiados desde cualquier navegador. Es una versión preliminar — la superposición guiada completa, el escaneo con cámara y el soporte offline están en la app iOS.', fr: "Cette interface web vous permet de téléverser des PDF, d'exécuter une analyse IA et de consulter les résultats guidés depuis n'importe quel navigateur. C'est une version préliminaire — la superposition guidée complète, la numérisation par caméra et le support hors ligne sont dans l'app iOS.", zh: '此网页界面让您可以上传 PDF、运行 AI 分析并在任何浏览器中查看引导结果。这是一个正在开发中的版本——完整的引导叠加层、实时摄像头扫描和离线支持均在 iOS 应用中。', ar: 'تتيح لك هذه الواجهة الويب رفع ملفات PDF وتشغيل تحليل الذكاء الاصطناعي ومراجعة النتائج الموجّهة من أي متصفح. هذا إصدار تجريبي — التراكب الموجّه الكامل ومسح الكاميرا الحي والدعم دون اتصال موجودة في تطبيق iOS.' },
  footer:          { en: 'FormFriend · Built at YHacks 2026', es: 'FormFriend · Creado en YHacks 2026', fr: 'FormFriend · Créé à YHacks 2026', zh: 'FormFriend · 于 YHacks 2026 构建', ar: 'FormFriend · تم بناؤه في YHacks 2026' },
}

export function t(lang, key, vars = {}) {
  const row = T[key]
  if (!row) return key
  let str = row[lang] ?? row['en'] ?? key
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(`{${k}}`, String(v))
  }
  return str
}

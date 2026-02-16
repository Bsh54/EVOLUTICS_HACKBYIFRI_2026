

export const messagesTranslations = {
    // MessageList.tsx and sub-components
    imageZoom_title: { en: 'Image zoomée : {filename}', zh: '图片缩放: {filename}' },
    imageZoom_close_aria: { en: 'Fermer la vue zoom de l\'image', zh: '关闭图片缩放视图' },
    imageZoom_close_title: { en: 'Fermer (Esc)', zh: '关闭 (Esc)' },
    welcome_greeting: { en: 'Comment puis-je vous aider aujourd\'hui ?', zh: '有什么可以帮忙的？' },
    welcome_suggestion_title: { en: 'Suggestions', zh: '建议' },
    suggestion_summarize_title: { en: 'Résumer l\'article', zh: '一句话概括' },
    suggestion_summarize_desc: {
        en: 'Veuillez lire le contenu suivant et distiller son thème principal en une seule phrase. Cette phrase doit inclure les éléments clés (qui, a fait quoi, quel a été le résultat) et rester concise et percutante :',
        zh: '请阅读以下内容，并用一句话精准提炼其核心主旨。这一句话需要包含关键要素（谁、做了什么、结果如何），保持简练有力：'
    },
    suggestion_summarize_short: { en: 'Extraire rapidement le thème central.', zh: '快速提炼核心主旨。' },
    suggestion_translate_title: { en: 'Traduction bilingue', zh: '中英互译' },
    suggestion_translate_desc: {
        en: `Vous êtes un traducteur professionnel maîtrisant le chinois et l'anglais. Veuillez traduire le texte suivant (du chinois vers l'anglais ou de l'anglais vers le chinois). Visez l'exactitude, la fluidité et l'élégance, en préservant le sens et le ton originaux. N'ajoutez aucune explication ni symbole supplémentaire :`,
        zh: `你是一位精通中英文的专业翻译。请将以下文本进行互译（中文转英文，英文转中文）。要求信达雅，保留原意和语气，不要添加任何解释或多余的符号：`
    },
    suggestion_translate_short: { en: 'Traduction bidirectionnelle professionnelle.', zh: '专业的中英双向互译。' },
    suggestion_ocr_title: { en: 'OCR (Reconnaissance de texte)', zh: 'OCR' },
    suggestion_ocr_desc: {
        en: 'Veuillez reconnaître et extraire tout le contenu textuel de l\'image jointe. Conservez le formatage et la structure des paragraphes d\'origine. S\'il contient des tableaux, affichez-les au format tableau Markdown. N\'ajoutez aucun propos liminaire ou de conclusion :',
        zh: '请识别并提取附加图片中的所有文字内容。保持原始排版和段落结构，如果包含表格请使用Markdown表格格式输出。不要添加任何开场白或结束语：'
    },
    suggestion_ocr_short: { en: 'Extraire le texte des images.', zh: '提取图片中的文字内容。' },
    suggestion_explain_title: { en: 'Expliquer un concept', zh: '概念解释' },
    suggestion_explain_desc: {
        en: 'Veuillez expliquer le concept suivant en termes simples. Utilisez des analogies ou des exemples concrets pour faciliter la compréhension, en évitant le jargon trop technique afin qu\'un débutant puisse facilement le saisir :',
        zh: '请用通俗易懂的语言解释以下概念。使用类比或生活中的例子来帮助理解，避免使用过于专业的术语，使零基础的初学者也能轻松掌握：'
    },
    suggestion_explain_short: { en: 'Simplifier des concepts complexes.', zh: '通俗易懂地解释复杂概念。' },
    suggestion_prompt_label: { en: 'Prompt', zh: '提示' },

    // New ASR and SRT Translations
    suggestion_asr_title: { en: 'Audio en texte', zh: '音频转文字' },
    suggestion_asr_desc: {
        en: 'Veuillez effectuer une reconnaissance vocale automatique (ASR) sur le fichier audio joint. Transcrivez le contenu parlé mot pour mot en texte. Ne résumez pas, affichez juste les mots exacts prononcés :',
        zh: '请对附加的音频文件进行自动语音识别（ASR）。将语音内容逐字转录为文本。不要总结，请直接输出所说的确切文字：'
    },
    suggestion_asr_short: { en: 'Transcrire textuellement les fichiers audio.', zh: '逐字转录音频文件内容。' },
    suggestion_srt_title: { en: 'Générer des sous-titres', zh: '生成字幕' },
    suggestion_srt_desc: {
        en: 'Veuillez générer un fichier de sous-titres SRT standard pour la vidéo jointe. Assurez-vous que les horodatages sont précis (format : 00:00:00,000 --> 00:00:00,000) et transcrivez le dialogue. Affichez UNIQUEMENT le contenu SRT dans un bloc de code :',
        zh: '请为附加的视频文件生成标准的 SRT 字幕文件。确保时间戳准确（格式：00:00:00,000 --> 00:00:00,000）并转录对话。请仅在代码块中输出 SRT 内容：'
    },
    suggestion_srt_short: { en: 'Générer des sous-titres SRT à partir d\'une vidéo.', zh: '从视频生成 SRT 字幕文件。' },

    // HTML Generation Translations
    suggestion_html_title: { en: 'Tableau intelligent', zh: '智能看板' },
    suggestion_html_desc: {
        en: 'Vous êtes un maquettiste. Veuillez utiliser le système Canvas pour organiser les informations fournies dans une page HTML structurée et interactive. Assurez-vous que le design est moderne et réactif. Veuillez conserver toutes les informations :',
        zh: '你是一位排版艺术家。请利用 Canvas 系统，将提供的信息整理成一个结构化、交互式的 HTML 页面。确保设计现代、响应式。请保留所有信息：'
    },
    suggestion_html_short: { en: 'Créer un tableau HTML interactif.', zh: '创建交互式 HTML 看板。' },

    welcome_title: { en: 'Bienvenue sur My AI Front', zh: '欢迎使用 My AI Front' },
    welcome_p1: { en: 'Commencez une conversation en tapant ci-dessous. Vous pouvez également joindre des fichiers, charger des scénarios via le bouton', zh: '在下方输入文字开始对话。您也可以附加文件，或通过' },
    welcome_p2: { en: 'Gérer les scénarios', zh: '管理场景' },
    welcome_p3: { en: 'ou configurer les paramètres.', zh: '按钮加载场景，或进行设置。' },
    retry_button_title: { en: 'Réessayer', zh: '重试' },
    retry_and_stop_button_title: { en: 'Arrêter et réessayer', zh: '停止并重试' },
    copy_button_title: { en: 'Copier le contenu', zh: '复制内容' },
    copied_button_title: { en: 'Copié !', zh: '已复制！' },
    generate_canvas_title: { en: 'Visualiser avec Canvas', zh: '使用 Canvas 可视化' },
    export_as_title: { en: 'Exporter en tant que {type}', zh: '导出为 {type}' },
    exporting_title: { en: 'Exportation de {type}...', zh: '正在导出 {type}...' },
    exported_title: { en: '{type} exporté !', zh: '{type} 已导出！' },
    export_failed_title: { en: 'L\'exportation a échoué.', zh: '导出失败。' },
    tokens_unit: { en: 'jetons', zh: '个令牌' },
    thinking_text: { en: 'Réflexion...', zh: '思考中...' },
    thinking_took_time: { en: 'Réflexion pendant {duration}', zh: '已思考 {duration}' },
    metrics_ttft: { en: 'TTFT', zh: '首字' },
    cancelled_by_user: { en: '[Annulé par l\'utilisateur]', zh: '[用户已取消]' },
    stopped_by_user: { en: '[Arrêté par l\'utilisateur]', zh: '[用户已停止]' },
    empty_response_error: { en: 'Le modèle n\'a pas fourni de réponse. Cela peut être dû à des filtres de sécurité ou à d\'autres restrictions de contenu.', zh: '模型未提供任何回复。这可能是由于安全过滤器或其他内容限制所致。' },
    code_fullscreen_monitor: { en: 'Plein écran moniteur', zh: '显示器全屏' },
    code_fullscreen_modal: { en: 'Superposition d\'aperçu', zh: '预览弹窗' },
};

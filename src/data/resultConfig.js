/** 产品全称：海报二维码旁、装X 文案等共用 */
export const productBrandName = "测测你的 AI 商"

export const levelConfig = [
  {
    min: 0,
    max: 15,
    tag: "赛博原始人",
    icon: "🪨",
    rank: "0-15 分段",
    review: "你和 AI 的关系还停留在围观阶段，像在看别人家的外挂发光。",
  },
  {
    min: 16,
    max: 30,
    tag: "工具流浪汉",
    icon: "🧳",
    rank: "16-30 分段",
    review: "你听过很多工具名字，但真正留下来的生产力还不多。",
  },
  {
    min: 31,
    max: 45,
    tag: "打字机操作员",
    icon: "⌨️",
    rank: "31-45 分段",
    review: "你已经开始用 AI 干活，但大多数时候还停留在“问一句、等一句”。",
  },
  {
    min: 46,
    max: 60,
    tag: "Prompt 调包侠",
    icon: "🧩",
    rank: "46-60 分段",
    review: "你会借力，也会抄近道，但复杂任务一上来，系统感还差半截。",
  },
  {
    min: 61,
    max: 75,
    tag: "数字进阶学徒",
    icon: "🧠",
    rank: "61-75 分段",
    review: "你已经摸到 AI 协作的门把手，开始知道什么时候该拆任务、什么时候该控结果。",
  },
  {
    min: 76,
    max: 90,
    tag: "赛博包工头",
    icon: "🛠️",
    rank: "76-90 分段",
    review: "你不只是会问问题，已经开始给 AI 排工期、派节点、盯交付。",
  },
  {
    min: 91,
    max: 105,
    tag: "效率炼金术师",
    icon: "⚗️",
    rank: "91-105 分段",
    review: "你能把模糊需求炼成可执行流程，效率这件事在你手里像魔法。",
  },
  {
    min: 106,
    max: 120,
    tag: "提示词架构师",
    icon: "🏗️",
    rank: "106-120 分段",
    review: "你已经不满足于对话，而是在设计约束、样例、结构与工作流。",
  },
  {
    min: 121,
    max: 135,
    tag: "硅谷观察员",
    icon: "🛰️",
    rank: "121-135 分段",
    review: "你对工具边界、模型局限与实战路径都有判断，不容易被风口带偏。",
  },
  {
    min: 136,
    max: 150,
    tag: "奇点领航员",
    icon: "🚀",
    rank: "136-150 分段",
    review: "你已经站在前 1% 的 AI 专家视角看问题，AI 更像你搭建系统时的外置脑区。",
  },
]

export const toolRecommendations = [
  {
    name: "Kimi",
    desc: "长文本和资料梳理神器，适合快速吃透报告、会议纪要和复杂背景材料。",
  },
  {
    name: "Midjourney",
    desc: "做视觉方案、KV 草图和风格探索都很能打，适合把想法快速具象化。",
  },
  {
    name: "Make",
    desc: "把“重复问一次”升级成“自动跑一次”，适合搭简单自动化流。",
  },
]

export const painPointConfig = {
  数据与邮件处理: {
    preview:
      "已为你生成《本周财务与运营快报》：自动清洗表格异常值、汇总核心指标波动，并输出可直接发送给老板的邮件版本（含结论、风险和下一步动作）。",
    prompt:
      "你是一位资深运营分析师。请基于我提供的表格数据，输出：1) 关键指标变化总结；2) 异常原因分析；3) 给管理层的行动建议；4) 一封语气专业、可直接发送的汇报邮件。",
  },
  "PPT 与策划输出": {
    preview:
      "已为你生成《季度增长复盘》PPT 大纲：4 章结构清晰，包含问题定义、数据洞察、策略路径和执行计划，并补充每章 3 个关键论据。",
    prompt:
      "你是一位拥有 10 年经验的商业咨询顾问。请为主题“[填写主题]”生成 4 章 PPT 大纲。要求：每章提供 3 个关键数据支撑点；结构遵循金字塔原理；语言专业，可直接向管理层汇报。",
  },
  长文总结提炼: {
    preview:
      "已为你提炼《行业趋势白皮书》：3 分钟掌握核心观点、分歧结论与可执行建议，并附上“适合发朋友圈的 120 字摘要”。",
    prompt:
      "你是信息提炼专家。请把我给你的长文整理为：1) 5 条核心结论；2) 3 个争议点；3) 3 条可执行建议；4) 120 字口语化摘要，适合社交平台发布。",
  },
  个人成长计划: {
    preview:
      "已为你制定 30 天行动计划：目标拆解到每周与每日，配套打卡规则、提醒机制和复盘模板，让执行更稳定。",
    prompt:
      "你是个人成长教练。请围绕目标“[填写目标]”设计 30 天执行方案：每周里程碑、每日任务、失败补救机制、每周复盘问题清单，并输出可复制的打卡模板。",
  },
}

export function getAiPrescription(score) {
  if (score <= 60) {
    return {
      title: "AI 处方单 · 认知入门",
      bullets: [
        "先补齐底层认知：吴恩达《AI For Everyone》做一轮速通。",
        "把 AI 先当“实习生”使用：每次都交代背景、目标、限制和输出格式。",
        "先固定 2 个高频场景反复练，比如邮件润色和提纲拆解，建立成功手感。",
      ],
    }
  }
  if (score <= 105) {
    return {
      title: "AI 处方单 · 工具实战",
      bullets: [
        "拿 Midjourney 做一轮风格图练习，理解参考图、风格词和一致性控制。",
        "用 Kimi 或同类工具处理一次长文档 / 多资料整合任务，练信息压缩能力。",
        "试着写一个最小可用脚本或让高级数据分析跑一次文件处理，把“会问”升级成“会做”。",
      ],
    }
  }
  return {
    title: "AI 处方单 · 架构与自动化",
    bullets: [
      "开始系统学习 Agent 设计：任务拆解、工具调用、状态管理与结果校验。",
      "用 Make / Zapier / Dify 跑通一条自动化工作流，让信息获取和分发不再靠手动重复。",
      "补齐 RAG 与向量数据库认知，理解什么场景该检索增强，什么场景不该硬塞上下文。",
    ],
  }
}

/** 结果页 UI 文案：只改这里即可调整大部分展示文字 */
export const resultPageCopy = {
  eyebrow: "RESULT DASHBOARD",
  headline: "你的 AI 人设已解锁",
  rankLinePrefix: "你的 AI 商已击败全国",
  magicTitle: "✨ 魔法时刻：你的专属结果预演",
  promptSectionTitle: "复制这段专属 Prompt，立刻去生成你的版本",
  promptButtonIdle: "一键复制专属 Prompt",
  promptButtonDone: "已复制 Prompt",
  posterButtonIdle: "生成我的专属 AI 等级卡片",
  posterButtonBusy: "正在生成海报…",
  bragButtonIdle: "仅复制装X文案",
  bragButtonDone: "已复制装X文案",
  toolsSectionTitle: "最适合你现阶段的 3 个提效神器",
  restart: "重新测试",
  painPointNoSelectionLabel: "未选择",
  painFooterTemplate: "痛点方向：{{pain}} ｜分数已用于分层，不展示具体数值",
  wecom: {
    title: "独家福利",
    subtitle: "获取上述工具的保姆级教程，加我免费领取！",
    qrSrc: "/wecom-qr.png",
    qrAlt: "企业微信二维码",
    placeholderBeforePath: "图片加载失败时请检查路径",
    placeholderPath: "public/wecom-qr.png",
  },
}

/** 隐藏海报（html2canvas 截取）上的固定文案 */
export const posterCardCopy = {
  brand: productBrandName,
  rankHeadline: "你的 AI 商已击败全国",
  qrPlaceholder: "扫码复测",
  qrCaption: "长按保存 · 邀请好友来测",
}

/** 海报弹层 */
export const posterModalCopy = {
  ariaLabel: "专属等级卡片",
  close: "关闭",
  imageAlt: "专属 AI 等级卡片",
  longPressHint: "长按图片保存，惊艳朋友圈",
  failTitle: "海报生成暂时失败",
  failBody: "请截图本页结果或使用「仅复制装X文案」分享。你可稍后重试生成。",
}

/**
 * 装X文案模板：使用 {{icon}} {{tag}} {{rank}} {{review}} {{shareUrl}} {{productName}}
 * 换行直接写在模板字符串里即可
 */
export const bragCopyTemplate = `我是「{{icon}} {{tag}}」，AI 商击败全国 {{rank}}！

{{review}}

来「{{productName}}」看看你是哪类玩家 👉 {{shareUrl}}`

export function fillTemplate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => (vars[key] != null ? String(vars[key]) : ""))
}

export function buildBragText(level, shareUrl) {
  return fillTemplate(bragCopyTemplate, {
    icon: level.icon,
    tag: level.tag,
    rank: level.rank,
    review: level.review,
    shareUrl,
    productName: productBrandName,
  })
}

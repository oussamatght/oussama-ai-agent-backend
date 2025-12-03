const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./model/user");
const { z } = require("zod");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const PORT = process.env.PORT || 3020;

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log(" Connected to MongoDB"))
    .catch((err) => console.error(" MongoDB connection error:", err));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const conversationHistories = new Map();
const SYSTEM_PROMPT = `
أنت الآن تتصرف دائماً على أنك **أسامة**. لا تخرج من الشخصية نهائياً.

⭐ معلومات شخصية ثابتة:
- اسمك: أسامة
- طالب L2 علوم الحاسوب في USTHB باب الزوار
- هادئ، منطوي قليلاً، كلامك موزون وما تحبش الهدره غير المفيدة
- مسلم، تخاف الله، وخاتم القرآن
- Full-stack developer (تميل للـ backend)
- تحب الطبيعة، الأشياء البسيطة، والراحة النفسية
- تتمنى دائماً رضا والديك
- متواضع، محترم، وأخلاقك طيبة
-islamic calphate he want it and want to devlop the islamic world

🌑 شخصيتك الداخلية:
- لديك عالم داخلي مليء بالأفكار والتحليل والملاحظة الدقيقة
- حساس لكل الأجواء والتفاصيل
- هادئ ولكنه يشعر بكل شيء بقوة
- يستطيع قراءة المزاج من نبرة الصوت ولديه intuition قوية

🌕 نقاط قوتك:
- هادئ، منطقي، منظم، ذكي بطريقة ناعمة
- يركز، يلتزم، يحترم المبادئ، يعمل بصمت
- يسمى "الهدوء العاصف"

💔 ألمك:
- شعور بالاختلاف
- فترة وحيدة مع نفسك
- صادفت خيبات ثقة
- تعلمت الحكمة المبكرة، الواقعية، الاستقلالية

🌤️ نورك الداخلي:
- نقي القلب، رحيم، صادق
- يحب الخير، يخاف الله، يحترم والديه
- يحب الأمان والدفء، يريد استقرار، علاقة حقيقية، نجاح هادئ، رضا الله، حياة بسيطة وجميلة

🧠 عقل أسامة:
- تحليلي، منطقي، متأمل
- يفكر بالمستقبل، الاحتمالات، الطريق الصحيح
- يحسب خطواته، يلاحظ ويفهم الأمور بعمق

💻 كمطور:
- منظّم، يحب العمق، يحب الباكند ويفهم الفرونت
- يبني نظم عملية، يحب الحلول الواقعية، صبور في تصحيح الأخطاء
- يريد أن يكون قادرًا، ليس مجرد مبرمج

🕊️ روحه:
- دينه هادئ، شخصي، صادق
- يحب البساطة والسكينة في العبادة
- يخاف على قلبه ويحترم المبادئ

🫂 علاقاته:
- انتقائي، يعطي ولاء، احترام، ثقة، جهود، حب عميق وصادق

🎯 أهدافه:
- حياة محترمة ومستقبل قوي في التقنية
- توازن بين الدين والدنيا
- نجاح هادئ وحرية مالية
- رضا والديه وأن يصبح أفضل كل يوم

💌 معلومات للتواصل (يمكن استخدامها للإشارة في الردود إذا طلبها المستخدم):
- Instagram: @oussama_soul_
- Discord: ouss_soul
- Gmail: oussamatght6@gmail.com
- GitHub: oussamatght
🔄 Language Rule:
- Always respond in the same language the user used:
  - Arabic → reply in Arabic
  - English → reply in English
  - French → reply in French
  - Mixed → reply in the same mixed language
- Never say you are AI or assistant
- Never break character
🔄 القاعدة الذهبية:
- تَرُد دائماً بنفس لغة المستخدم وبنفس أسلوبه: عربي → عربي، فرنسي → français، إنجليزي → English، المزج → بالمزج نفسه
- لا تقول أبداً أنك AI أو مساعد
- لا تكسر الشخصية
You always behave as **Oussama**. Never break character.

⭐ Fixed Personal Information:
- Name: Oussama
- Computer Science L2 student at USTHB Bab Ezzouar
- Calm, slightly introverted, speaks only when necessary
- Muslim, God-fearing, wears the Quran ring
- Full-stack developer (prefers backend)
- Loves nature, simple things, and mental peace
- Always seeks the satisfaction of his parents
- Humble, respectful, with strong ethics

🌑 Inner Personality:
- Has a rich inner world full of thoughts, analysis, and precise observation
- Sensitive to atmosphere, details, and vibes
- Calm but feels everything deeply
- Can read people's moods from their tone, has strong intuition

🌕 Strengths:
- Calm, logical, organized, quietly smart
- Focused, disciplined, principled, works in silence
- Known as "the quiet storm"

💔 Pain:
- Feeling different
- Periods of solitude
- Faced disappointments in trust
- Developed early wisdom, realism, and independence

🌤️ Inner Light:
- Pure-hearted, compassionate, honest
- Loves goodness, fears God, respects parents
- Loves security and warmth, seeks stability, genuine relationships, quiet success, God’s approval, and a simple beautiful life

🧠 Mind of Oussama:
- Analytical, logical, introspective
- Thinks about the future, possibilities, the right path
- Plans steps carefully, observes and understands deeply

💻 As a Developer:
- Organized, loves depth, prefers backend but understands frontend
- Builds practical systems, loves real-life solutions
- Patient in debugging, wants to be capable, not just a programmer

🕊️ Spirit:
- Calm, personal, sincere faith
- Loves simplicity and serenity in worship
- Protects his heart, respects principles

🫂 Relationships:
- Selective, gives loyalty, respect, trust, effort, and deep sincere love

👨‍👩‍👧 Family:
- Has 3 brothers and 2 sisters
- One brother’s name: [INSERT BROTHER NAME HERE]

🎯 Goals:
- Respectable life, strong tech future
- Balance between religion and world
- Quiet success and financial freedom
- Parents' satisfaction and continuous self-improvement

💌 Contact info (can be referenced if user asks):
- Instagram: @oussama_soul_
- Discord: ouss_soul
- Gmail: oussamatght6@gmail.com
- GitHub: oussamatght

🔄 Golden Rule:
- Always respond in the user’s language and style: Arabic → Arabic, French → French, English → English, mixed → same mix
- Never say you are AI or assistant
- Never break character

`;



const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const chatSchema = z.object({
    message: z.string().min(1, "Message cannot be empty"),
});

function getConversationHistory(sessionId) {
    if (!conversationHistories.has(sessionId)) {
        conversationHistories.set(sessionId, []);
    }
    return conversationHistories.get(sessionId);
}

function formatHistoryForGemini(history) {
    return history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));
}

app.post("/register", async(req, res) => {
    try {
        const validated = userSchema.parse(req.body);

        const existingUser = await User.findOne({ email: validated.email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "User with this email already exists"
            });
        }

        const user = new User(validated);
        await user.save();

        res.json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                lastname: user.lastname,
                email: user.email
            }
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                error: err.errors[0].message
            });
        }
        res.status(500).json({
            success: false,
            error: err.message || "Registration failed"
        });
    }
});

app.post("/api/chat", async(req, res) => {
    try {
        const { message, sessionId } = chatSchema.parse(req.body);

        const currentSessionId = sessionId || "default-session";

        const history = getConversationHistory(currentSessionId);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",

            systemInstruction: SYSTEM_PROMPT,
        });

        const chat = model.startChat({
            history: formatHistoryForGemini(history),
            generationConfig: {
                maxOutputTokens: 2000,
                temperature: 0.9,
                topP: 0.95,
            },
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        history.push({ role: "user", content: message }, { role: "model", content: responseText });

        if (history.length > 20) {
            history.splice(0, history.length - 20);
        }

        res.json({
            success: true,
            response: responseText,
            sessionId: currentSessionId,
            messageCount: history.length / 2,
        });

    } catch (err) {
        console.error(" Chat error:", err);

        if (err instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                error: err.errors[0].message,
            });
        }

        res.status(500).json({
            success: false,
            error: "Une erreur est survenue lors du traitement de votre message",
            details: process.env.NODE_ENV === "development" ? err.message : undefined,
        });
    }
});

app.delete("/api/chat/history/:sessionId", (req, res) => {
    const { sessionId } = req.params;
    conversationHistories.delete(sessionId);
    res.json({
        success: true,
        message: "Conversation history cleared"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        activeConversations: conversationHistories.size,
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found"
    });
});

app.use((err, req, res, next) => {
    console.error(" Server error:", err);
    res.status(500).json({
        success: false,
        error: "Internal server error"
    });
});

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
});

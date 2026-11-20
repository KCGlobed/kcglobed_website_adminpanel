// Content for the book landing page design on the website (/book/<id>/<slug>).
// Sent to the API as the `json_data` field of a book.
// Price, stock, ISBN, pages, language, publisher and author are NOT part of it:
// the website reads those from the normal book fields.

export interface TitleText {
    title: string;
    text: string;
}

export interface PagePreview {
    image: string;
    caption: string;
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface AuthorHighlight {
    value: string;
    label: string;
}

// "About the author" section. Any field left empty shows Dr. Kamal Chhabra's profile on the website.
export interface LandingAuthor {
    name: string;
    image: string;
    heading: string;
    credentials: string;
    highlights: AuthorHighlight[];
    // Text wrapped in **double asterisks** shows in bold
    bio: string;
}

export const defaultAuthor = (): LandingAuthor => ({
    name: "Dr. Kamal Chhabra",
    image: "",
    heading: "Authored by an Audit & Finance Professional. Built on Real-World Expertise.",
    credentials: "US CPA | CA | Founder & CEO, KC GlobEd",
    highlights: [
        { value: "20+ Years", label: "Professional Experience" },
        { value: "Author of 11", label: "Professional Books" },
    ],
    bio: "Dr. Kamal Chhabra is a **techno-commercial veteran with 20+ years of experience** across Indian and international markets, with professional experience at leading Big Four firms, including **PwC and EY**. A **US CPA and Indian CA**, he is the Founder & CEO and lead instructor at KC GlobEd, and the author of multiple professional books. He has served as Director – International Relations, North America, at MSME & Startup Forum, supporting Indian businesses in global expansion. He also mentors MSMEs and startups, facilitates investment support, and co-founded **ScaleX Times**, a US-based investor network connecting global investors with Indian ventures.",
});

export interface LandingPage {
    enabled: boolean;
    meta_title: string;
    meta_description: string;
    short_name: string;
    hero: {
        eyebrow: string;
        title: string;
        tagline: string;
        lead: string;
        rating_score: string;
        rating_count: string;
        byline: string;
        image: string;
        image_caption: string;
    };
    preparation: {
        eyebrow: string;
        heading: string;
        lead: string;
        focus_heading: string;
        focus_lead: string;
    };
    chapters: { eyebrow: string; heading: string; intro: string; items: TitleText[] };
    why: { eyebrow: string; heading: string; intro: string; items: TitleText[] };
    // Roadmap: steps are shown in up to three phases (Learn, Apply, Revise); a step's text is optional
    journey: { eyebrow: string; heading: string; intro: string; steps: TitleText[]; copy: string };
    inside: {
        eyebrow: string;
        heading: string;
        facts: string;
        contents: string[];
        covers_image: string;
        pages: PagePreview[];
    };
    audience: { heading: string; lead: string; items: string[] };
    author: LandingAuthor;
    what_you_get: { heading: string; items: string[] };
    details: { heading: string; summary: string; image: string };
    faq: FaqItem[];
    final: { heading: string; text: string };
}

export const emptyLandingPage = (): LandingPage => ({
    enabled: false,
    meta_title: "",
    meta_description: "",
    short_name: "",
    hero: {
        eyebrow: "",
        title: "",
        tagline: "",
        lead: "",
        rating_score: "5.0",
        rating_count: "100 customer ratings",
        byline: "Written by Dr. Kamal Chhabra | Published by KC GlobEd",
        image: "",
        image_caption: "",
    },
    preparation: { eyebrow: "A Clearer Way to Prepare", heading: "", lead: "", focus_heading: "", focus_lead: "" },
    chapters: { eyebrow: "Explore What's Inside", heading: "", intro: "", items: [{ title: "", text: "" }] },
    why: { eyebrow: "Why This Book", heading: "", intro: "", items: [{ title: "", text: "" }] },
    journey: { eyebrow: "Your Study Roadmap", heading: "", intro: "", steps: [{ title: "", text: "" }], copy: "" },
    inside: { eyebrow: "Book Preview", heading: "", facts: "", contents: [""], covers_image: "", pages: [] },
    audience: { heading: "Who is this book for?", lead: "This book is ideal for:", items: [""] },
    author: defaultAuthor(),
    what_you_get: { heading: "", items: [""] },
    details: { heading: "", summary: "", image: "" },
    faq: [{ question: "", answer: "" }],
    final: { heading: "Ready to Take the Next Step in Your Preparation?", text: "" },
});

// Text from the live ACCA Audit & Assurance page (book 78), used as a starting point for a new book.
// Images are left empty because every book needs its own.
export const sampleLandingPage = (): LandingPage => ({
    enabled: true,
    meta_title: "ACCA Audit & Assurance Study Book | KC GlobEd",
    meta_description:
        "Build a stronger understanding of auditing concepts with a dedicated study resource for focused learning, effective revision and ACCA exam preparation.",
    short_name: "ACCA Audit & Assurance Book",
    hero: {
        eyebrow: "ACCA | Applied Skills",
        title: "ACCA Audit & Assurance Study Book",
        tagline: "Your Guide to Smarter Preparation",
        lead: "Build a stronger understanding of auditing concepts with a dedicated study resource for focused learning, effective revision and ACCA exam preparation.",
        rating_score: "5.0",
        rating_count: "100 customer ratings",
        byline: "Written by Dr. Kamal Chhabra | Published by KC GlobEd",
        image: "",
        image_caption: "ACCA Audit & Assurance · Published by KC GlobEd",
    },
    preparation: {
        eyebrow: "A Clearer Way to Prepare",
        heading: "Finding Audit & Assurance Difficult?",
        lead: "Understanding Audit & Assurance requires more than memorising concepts. It involves knowing why audit procedures are performed and how different stages of an audit connect.",
        focus_heading: "One Book. Six Core Areas. A More Focused Approach to Audit.",
        focus_lead:
            "The KC GlobEd ACCA Audit & Assurance Book brings together essential auditing concepts in an organised format, helping you build subject knowledge and stay focused throughout your studies.",
    },
    chapters: {
        eyebrow: "Explore What's Inside",
        heading: "Key Topics Covered in the ACCA Audit & Assurance Book",
        intro: "Develop a well-rounded understanding of auditing, from fundamental principles to professional procedures.",
        items: [
            { title: "Audit Framework and Regulation", text: "Understand the principles of auditing, regulatory requirements and ethical responsibilities that guide an auditor's work." },
            { title: "Planning and Risk Assessment", text: "Learn how auditors plan engagements, identify audit risks and develop appropriate responses to assessed risks." },
            { title: "Substantive Procedures", text: "Understand the purpose of substantive audit procedures and how they help auditors identify material misstatements." },
            { title: "Internal Control", text: "Understand how internal control systems operate, how auditors evaluate controls and identify potential weaknesses." },
            { title: "Audit Evidence", text: "Explore how auditors obtain and evaluate sufficient, appropriate audit evidence to support their conclusions." },
            { title: "Audit Completion and Reporting", text: "Learn how auditors review audit findings, evaluate conclusions and understand the principles of audit reporting." },
        ],
    },
    why: {
        eyebrow: "Why This Book",
        heading: "A Structured Approach to ACCA Audit & Assurance Learning",
        intro: "With clearly organised subject coverage and an emphasis on understanding, this book is designed to support you throughout your preparation.",
        items: [
            { title: "Conceptual clarity", text: "Understand the principles behind audit procedures instead of simply memorising them" },
            { title: "Structured coverage", text: "Move through the key areas of Audit & Assurance in a logical and focused manner." },
            { title: "Practical understanding", text: "Build an understanding of how audit concepts connect with the actual audit process." },
            { title: "Effective revision", text: "Use a dedicated subject resource to revisit important concepts throughout your preparation" },
            { title: "Focused ACCA preparation", text: "Keep your Audit & Assurance learning centred around the core areas you need to study." },
        ],
    },
    journey: {
        eyebrow: "Your Study Roadmap",
        heading: "Your ACCA Audit & Assurance Preparation, From Start to Finish",
        intro: "",
        steps: ["Understand Fundamentals", "Build Knowledge", "Connect Concepts", "Explore Applications", "Reinforce Learning", "Prepare for Final Preparation"].map(
            (title) => ({ title, text: "" })
        ),
        copy: "Keep your learning and revision focused with one dedicated Audit & Assurance study resource.",
    },
    inside: {
        eyebrow: "Book Preview",
        heading: "A Closer Look at Your Audit & Assurance Study Book",
        facts: "376 pages | English | ACCA Audit & Assurance",
        contents: [
            "Audit Regulation & Framework",
            "Planning & Risk Assessment",
            "Internal Control",
            "Audit Evidence",
            "Review & Reporting / Substantive Procedures",
            "Completion & Reporting",
        ],
        covers_image: "",
        pages: [],
    },
    audience: {
        heading: "Who is this book for?",
        lead: "This book is ideal for:",
        items: [
            "ACCA students preparing for Audit & Assurance",
            "Students looking for structured subject-wise preparation",
            "Students revising key Audit & Assurance concepts",
            "Learners looking for a dedicated Audit & Assurance resource",
        ],
    },
    author: defaultAuthor(),
    what_you_get: {
        heading: "Your ACCA Audit & Assurance Study Companion",
        items: [
            "376-page book",
            "English language",
            "Six core Audit & Assurance areas",
            "Structured subject coverage",
            "Revision-oriented resource",
            "Published by KC GlobEd",
        ],
    },
    details: { heading: "ACCA Audit & Assurance", summary: "376-page subject resource", image: "" },
    faq: [
        {
            question: "Is this ACCA Audit & Assurance Book suitable for self-study?",
            answer: "Yes, the book provides structured coverage of essential auditing concepts, helping students study independently and strengthen their understanding at their own pace.",
        },
        {
            question: "Can I use this book for both exam preparation and revision?",
            answer: "Yes, the book supports ACCA exam preparation and revision by helping students understand key audit concepts and revisit important topics throughout their studies.",
        },
    ],
    final: {
        heading: "Ready to Take the Next Step in Your Preparation?",
        text: "Bring greater focus to your ACCA studies with the Audit & Assurance book authored by Dr. Kamal Chhabra.",
    },
});

// The API may return the field as an object, a JSON string or null.
// Missing keys are filled from the empty template so the form never reads undefined.
// Every field empty: saved content is merged into this, so fields a book leaves out stay empty
// (and stay hidden on the website) instead of picking up the defaults meant for a new book.
const blankLandingPage = (): LandingPage => ({
    enabled: false,
    meta_title: "",
    meta_description: "",
    short_name: "",
    hero: { eyebrow: "", title: "", tagline: "", lead: "", rating_score: "", rating_count: "", byline: "", image: "", image_caption: "" },
    preparation: { eyebrow: "", heading: "", lead: "", focus_heading: "", focus_lead: "" },
    chapters: { eyebrow: "", heading: "", intro: "", items: [] },
    why: { eyebrow: "", heading: "", intro: "", items: [] },
    journey: { eyebrow: "", heading: "", intro: "", steps: [], copy: "" },
    inside: { eyebrow: "", heading: "", facts: "", contents: [], covers_image: "", pages: [] },
    audience: { heading: "", lead: "", items: [] },
    author: { name: "", image: "", heading: "", credentials: "", highlights: [], bio: "" },
    what_you_get: { heading: "", items: [] },
    details: { heading: "", summary: "", image: "" },
    faq: [],
    final: { heading: "", text: "" },
});

export function parseLandingPage(raw: unknown): LandingPage {
    let value: unknown = raw;
    if (typeof value === "string") {
        try {
            value = JSON.parse(value);
        } catch {
            return emptyLandingPage();
        }
    }
    if (!value || typeof value !== "object") return emptyLandingPage();

    const base = blankLandingPage();
    const saved = value as Record<string, unknown>;
    const merged: Record<string, unknown> = { ...base, ...saved };
    for (const key of Object.keys(base) as (keyof LandingPage)[]) {
        const fallback = base[key];
        if (fallback && typeof fallback === "object" && !Array.isArray(fallback)) {
            merged[key] = { ...fallback, ...((saved[key] as object) ?? {}) };
        }
    }
    if (!Array.isArray(merged.faq)) merged.faq = base.faq;
    // Books saved before the author section existed show the profile the website already uses
    if (!saved.author || typeof saved.author !== "object") merged.author = defaultAuthor();
    const author = merged.author as { highlights: unknown };
    if (!Array.isArray(author.highlights)) author.highlights = [];
    // Older saves hold journey steps as plain names
    const journey = merged.journey as { steps: unknown };
    journey.steps = (Array.isArray(journey.steps) ? journey.steps : []).map((step) =>
        typeof step === "string" ? { title: step, text: "" } : { title: "", text: "", ...(step as object) }
    );
    return merged as unknown as LandingPage;
}

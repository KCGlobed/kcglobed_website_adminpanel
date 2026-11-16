import React, { useRef, useState } from "react";
import { uploadLandingImage } from "../../../services/book";
import { useAlert } from "../../../context/AlertContext";
import { emptyLandingPage, sampleLandingPage } from "./landingPage";
import type { FaqItem, LandingPage, PagePreview, TitleText } from "./landingPage";

// Book landing page editor, shared by the create and update book forms.
// Sections follow the order of the page on the website.

interface LandingPageFieldsProps {
    value: LandingPage;
    onChange: React.Dispatch<React.SetStateAction<LandingPage>>;
    // Lets the form block submit while images are still uploading
    onUploadingChange?: (uploading: boolean) => void;
}

const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";
const smallButton = "px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40";
const addButton = "mt-2 px-3 py-1.5 text-sm text-blue-700 border border-dashed border-blue-400 rounded-md hover:bg-blue-50";

const moveItem = <T,>(list: T[], from: number, to: number): T[] => {
    if (to < 0 || to >= list.length) return list;
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
};

function Field({ label, hint, value, onChange, placeholder, textarea }: {
    label: string;
    hint?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    textarea?: boolean;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {textarea ? (
                <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
            ) : (
                <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
            )}
            {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        </div>
    );
}

function Section({ number, title, hint, children }: { number: number; title: string; hint: string; children: React.ReactNode }) {
    return (
        <details className="group bg-white border border-gray-200 rounded-lg" open>
            <summary className="cursor-pointer select-none list-none px-4 py-3 flex items-center justify-between">
                <span>
                    <span className="font-semibold text-gray-800">{number}. {title}</span>
                    <span className="block text-xs text-gray-500">{hint}</span>
                </span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="px-4 pb-4 space-y-4">{children}</div>
        </details>
    );
}

function RowButtons({ index, length, onMove, onRemove }: {
    index: number;
    length: number;
    onMove: (to: number) => void;
    onRemove: () => void;
}) {
    return (
        <div className="flex gap-1 shrink-0">
            <button type="button" className={smallButton} disabled={index === 0} onClick={() => onMove(index - 1)} title="Move up">↑</button>
            <button type="button" className={smallButton} disabled={index === length - 1} onClick={() => onMove(index + 1)} title="Move down">↓</button>
            <button type="button" className={`${smallButton} text-red-600`} onClick={onRemove} title="Remove">✕</button>
        </div>
    );
}

function StringList({ label, items, onChange, placeholder, addLabel }: {
    label: string;
    items: string[];
    onChange: (items: string[]) => void;
    placeholder?: string;
    addLabel: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="space-y-2">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="w-6 text-xs text-gray-500 text-right">{i + 1}.</span>
                        <input
                            value={item}
                            onChange={e => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
                            placeholder={placeholder}
                            className={inputClass}
                        />
                        <RowButtons
                            index={i}
                            length={items.length}
                            onMove={to => onChange(moveItem(items, i, to))}
                            onRemove={() => onChange(items.filter((_, j) => j !== i))}
                        />
                    </div>
                ))}
            </div>
            <button type="button" className={addButton} onClick={() => onChange([...items, ""])}>+ {addLabel}</button>
        </div>
    );
}

function TitleTextList({ label, items, onChange, titlePlaceholder, textPlaceholder, addLabel }: {
    label: string;
    items: TitleText[];
    onChange: (items: TitleText[]) => void;
    titlePlaceholder: string;
    textPlaceholder: string;
    addLabel: string;
}) {
    const edit = (i: number, patch: Partial<TitleText>) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="space-y-3">
                {items.map((item, i) => (
                    <div key={i} className="flex gap-2 items-start p-3 border border-gray-200 rounded-md bg-gray-50">
                        <span className="w-6 pt-2 text-xs text-gray-500 text-right">{i + 1}.</span>
                        <div className="flex-1 space-y-2">
                            <input value={item.title} onChange={e => edit(i, { title: e.target.value })} placeholder={titlePlaceholder} className={inputClass} />
                            <textarea rows={2} value={item.text} onChange={e => edit(i, { text: e.target.value })} placeholder={textPlaceholder} className={inputClass} />
                        </div>
                        <RowButtons
                            index={i}
                            length={items.length}
                            onMove={to => onChange(moveItem(items, i, to))}
                            onRemove={() => onChange(items.filter((_, j) => j !== i))}
                        />
                    </div>
                ))}
            </div>
            <button type="button" className={addButton} onClick={() => onChange([...items, { title: "", text: "" }])}>+ {addLabel}</button>
        </div>
    );
}

function ImageInput({ label, hint, url, onUrl, busy, onFile }: {
    label: string;
    hint: string;
    url: string;
    onUrl: (url: string) => void;
    busy: boolean;
    onFile: (file: File) => void;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex gap-4 items-start">
                <div className="w-28 h-28 shrink-0 border border-dashed border-gray-300 rounded-md bg-white flex items-center justify-center overflow-hidden">
                    {busy ? (
                        <span className="text-xs text-gray-500">Uploading…</span>
                    ) : url ? (
                        <img src={url} alt={label} className="w-full h-full object-contain" />
                    ) : (
                        <span className="text-xs text-gray-400">No image</span>
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.svg"
                        disabled={busy}
                        onChange={e => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (file) onFile(file);
                        }}
                        className={inputClass}
                    />
                    <input value={url} onChange={e => onUrl(e.target.value)} placeholder="…or paste an image link" className={inputClass} />
                    <p className="text-xs text-gray-500">{hint}</p>
                    {url && (
                        <button type="button" className="text-xs text-red-600 hover:underline" onClick={() => onUrl("")}>Remove image</button>
                    )}
                </div>
            </div>
        </div>
    );
}

const LandingPageFields: React.FC<LandingPageFieldsProps> = ({ value, onChange, onUploadingChange }) => {
    const { showAlert } = useAlert();
    const pending = useRef(0);
    const [uploadingKeys, setUploadingKeys] = useState<string[]>([]);

    // Uploads one file; `key` marks which image box shows the spinner
    const upload = async (file: File, key: string): Promise<string | null> => {
        pending.current += 1;
        onUploadingChange?.(true);
        setUploadingKeys(keys => [...keys, key]);
        try {
            return await uploadLandingImage(file);
        } catch (err) {
            showAlert(`Could not upload ${file.name}: ${err instanceof Error ? err.message : "upload failed"}`, "error");
            return null;
        } finally {
            pending.current -= 1;
            if (pending.current === 0) onUploadingChange?.(false);
            setUploadingKeys(keys => {
                const index = keys.indexOf(key);
                return index === -1 ? keys : keys.filter((_, i) => i !== index);
            });
        }
    };

    const patch = <K extends keyof LandingPage>(key: K, part: Partial<LandingPage[K]>) =>
        onChange(prev => ({ ...prev, [key]: { ...(prev[key] as object), ...part } }));

    // Props for one image box: uploads the chosen file and stores the returned link
    const imageProps = (uploadKey: string, url: string, onUrl: (url: string) => void) => ({
        url,
        onUrl,
        busy: uploadingKeys.includes(uploadKey),
        onFile: async (file: File) => {
            const link = await upload(file, uploadKey);
            if (link) onUrl(link);
        },
    });

    const { hero, preparation, chapters, why, journey, inside, audience, what_you_get, details, faq, final } = value;

    const addPagePreviews = async (files: FileList) => {
        const list = Array.from(files);
        // Upload three at a time and add each page as soon as its link comes back, keeping the selection order
        const links: (string | null)[] = new Array(list.length).fill(null);
        let next = 0;
        const worker = async () => {
            while (next < list.length) {
                const i = next++;
                links[i] = await upload(list[i], "pages");
            }
        };
        await Promise.all([worker(), worker(), worker()]);
        const added: PagePreview[] = list
            .map((file, i) => ({ image: links[i] ?? "", caption: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") }))
            .filter(page => page.image);
        if (added.length) onChange(prev => ({ ...prev, inside: { ...prev.inside, pages: [...prev.inside.pages, ...added] } }));
    };

    const editPage = (i: number, part: Partial<PagePreview>) =>
        onChange(prev => ({
            ...prev,
            inside: { ...prev.inside, pages: prev.inside.pages.map((p, j) => (j === i ? { ...p, ...part } : p)) },
        }));

    const editFaq = (i: number, part: Partial<FaqItem>) =>
        onChange(prev => ({ ...prev, faq: prev.faq.map((f, j) => (j === i ? { ...f, ...part } : f)) }));

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-700">Landing Page (Website Design)</h2>
                    <p className="text-sm text-gray-500 max-w-2xl">
                        Turn this on to show the book with the landing page design, like the ACCA Audit &amp; Assurance book page.
                        Price, stock, ISBN, pages, language, publisher and author are taken from the fields above.
                    </p>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Use landing page design</span>
                    <input
                        type="checkbox"
                        checked={value.enabled}
                        onChange={e => onChange(prev => ({ ...prev, enabled: e.target.checked }))}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                    />
                </label>
            </div>

            {value.enabled && (
                <>
                    <div className="flex flex-wrap gap-2 text-sm">
                        <button
                            type="button"
                            className="px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
                            onClick={() => {
                                if (window.confirm("Replace the landing page text with the sample from the ACCA Audit & Assurance book? Images you added are kept.")) {
                                    onChange(prev => {
                                        const sample = sampleLandingPage();
                                        return {
                                            ...sample,
                                            hero: { ...sample.hero, image: prev.hero.image },
                                            inside: { ...sample.inside, covers_image: prev.inside.covers_image, pages: prev.inside.pages },
                                            details: { ...sample.details, image: prev.details.image },
                                        };
                                    });
                                }
                            }}
                        >
                            Fill with sample text
                        </button>
                        <button
                            type="button"
                            className="px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-100 text-red-600"
                            onClick={() => {
                                if (window.confirm("Clear all landing page fields?")) onChange({ ...emptyLandingPage(), enabled: true });
                            }}
                        >
                            Clear all
                        </button>
                    </div>

                    <Section number={1} title="Top banner" hint="First thing visitors see: title, short intro, rating and the book image.">
                        <ImageInput
                            label="Book image"
                            hint="Book mockup shown on the right. Transparent PNG or WebP works best (about 1000 × 1170 px)."
                            {...imageProps("hero", hero.image, url => patch("hero", { image: url }))}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Small text above the title" value={hero.eyebrow} onChange={v => patch("hero", { eyebrow: v })} placeholder="ACCA | Applied Skills" />
                            <Field label="Title" value={hero.title} onChange={v => patch("hero", { title: v })} placeholder="ACCA Audit & Assurance Study Book" />
                            <Field label="Tagline (yellow line)" value={hero.tagline} onChange={v => patch("hero", { tagline: v })} placeholder="Your Guide to Smarter Preparation" />
                            <Field label="Caption under the image" value={hero.image_caption} onChange={v => patch("hero", { image_caption: v })} placeholder="ACCA Audit & Assurance · Published by KC GlobEd" />
                            <Field label="Rating" value={hero.rating_score} onChange={v => patch("hero", { rating_score: v })} placeholder="5.0" />
                            <Field label="Rating text" value={hero.rating_count} onChange={v => patch("hero", { rating_count: v })} placeholder="100 customer ratings" />
                        </div>
                        <Field label="Intro paragraph" textarea value={hero.lead} onChange={v => patch("hero", { lead: v })} placeholder="Build a stronger understanding of auditing concepts…" />
                        <Field label="Author line (under the price)" value={hero.byline} onChange={v => patch("hero", { byline: v })} placeholder="Written by Dr. Kamal Chhabra | Published by KC GlobEd" />
                    </Section>

                    <Section number={2} title="The problem this book solves" hint="Two columns under the banner: the student's difficulty and how the book helps.">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Small text above the heading" value={preparation.eyebrow} onChange={v => patch("preparation", { eyebrow: v })} placeholder="A Clearer Way to Prepare" />
                            <Field label="Heading (left)" value={preparation.heading} onChange={v => patch("preparation", { heading: v })} placeholder="Finding Audit & Assurance Difficult?" />
                            <Field label="Paragraph (left)" textarea value={preparation.lead} onChange={v => patch("preparation", { lead: v })} />
                            <Field label="Heading (right)" value={preparation.focus_heading} onChange={v => patch("preparation", { focus_heading: v })} placeholder="One Book. Six Core Areas…" />
                        </div>
                        <Field label="Paragraph (right)" textarea value={preparation.focus_lead} onChange={v => patch("preparation", { focus_lead: v })} />
                        <p className="text-xs text-gray-500 bg-white border border-gray-200 rounded p-2">
                            The info bar after this section (Written by, Book, Pages · Language, ISBN) is filled automatically from the book details.
                        </p>
                    </Section>

                    <Section number={3} title="Key topics" hint="Numbered cards (01, 02 …). Usually 6.">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Small text above the heading" value={chapters.eyebrow} onChange={v => patch("chapters", { eyebrow: v })} placeholder="Explore What's Inside" />
                            <Field label="Heading" value={chapters.heading} onChange={v => patch("chapters", { heading: v })} placeholder="Key Topics Covered in the … Book" />
                        </div>
                        <Field label="Intro line" value={chapters.intro} onChange={v => patch("chapters", { intro: v })} />
                        <TitleTextList
                            label="Topics"
                            items={chapters.items}
                            onChange={items => patch("chapters", { items })}
                            titlePlaceholder="Topic name, e.g. Audit Framework and Regulation"
                            textPlaceholder="One or two lines about the topic"
                            addLabel="Add topic"
                        />
                    </Section>

                    <Section number={4} title="Why this book" hint="Benefits with a tick mark. Usually 5.">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Small text above the heading" value={why.eyebrow} onChange={v => patch("why", { eyebrow: v })} placeholder="Why This Book" />
                            <Field label="Heading" value={why.heading} onChange={v => patch("why", { heading: v })} />
                        </div>
                        <Field label="Intro line" value={why.intro} onChange={v => patch("why", { intro: v })} />
                        <TitleTextList
                            label="Benefits"
                            items={why.items}
                            onChange={items => patch("why", { items })}
                            titlePlaceholder="Benefit, e.g. Conceptual clarity"
                            textPlaceholder="One line explaining it"
                            addLabel="Add benefit"
                        />
                    </Section>

                    <Section number={5} title="Preparation journey" hint="Steps joined by arrows, then a short line and a Buy button. Usually 6 steps.">
                        <Field label="Heading" value={journey.heading} onChange={v => patch("journey", { heading: v })} placeholder="Your … Preparation, From Start to Finish" />
                        <StringList label="Steps" items={journey.steps} onChange={steps => patch("journey", { steps })} placeholder="e.g. Understand Fundamentals" addLabel="Add step" />
                        <Field label="Line under the steps" value={journey.copy} onChange={v => patch("journey", { copy: v })} />
                    </Section>

                    <Section number={6} title="Book preview" hint="Contents list, cover photo and a slider of sample pages.">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Small text above the heading" value={inside.eyebrow} onChange={v => patch("inside", { eyebrow: v })} placeholder="Book Preview" />
                            <Field label="Heading" value={inside.heading} onChange={v => patch("inside", { heading: v })} placeholder="A Closer Look at Your … Study Book" />
                        </div>
                        <Field label="Facts line" value={inside.facts} onChange={v => patch("inside", { facts: v })} placeholder="376 pages | English | ACCA Audit & Assurance" />
                        <StringList label="Contents (numbered list)" items={inside.contents} onChange={contents => patch("inside", { contents })} placeholder="e.g. Planning & Risk Assessment" addLabel="Add chapter" />
                        <ImageInput
                            label="Front and back cover photo"
                            hint="Landscape photo of both covers (about 1200 × 830 px)."
                            {...imageProps("covers", inside.covers_image, url => patch("inside", { covers_image: url }))}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sample pages (slider)</label>
                            <p className="text-xs text-gray-500 mb-2">Select several page images at once. Portrait images (about 900 × 1600 px). Edit the caption under each one.</p>
                            <input
                                type="file"
                                multiple
                                accept=".jpg,.jpeg,.png,.webp"
                                disabled={uploadingKeys.includes("pages")}
                                onChange={e => {
                                    const files = e.target.files;
                                    if (files?.length) addPagePreviews(files);
                                    e.target.value = "";
                                }}
                                className={inputClass}
                            />
                            {uploadingKeys.includes("pages") && (
                                <p className="mt-2 text-sm text-blue-700">Uploading {uploadingKeys.filter(k => k === "pages").length} page(s)…</p>
                            )}
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {inside.pages.map((page, i) => (
                                    <div key={`${page.image}-${i}`} className="border border-gray-200 rounded-md bg-white p-2 space-y-2">
                                        <img src={page.image} alt={page.caption} className="w-full aspect-[9/16] object-contain bg-gray-50" />
                                        <input value={page.caption} onChange={e => editPage(i, { caption: e.target.value })} placeholder="Caption" className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                                        <RowButtons
                                            index={i}
                                            length={inside.pages.length}
                                            onMove={to => patch("inside", { pages: moveItem(inside.pages, i, to) })}
                                            onRemove={() => patch("inside", { pages: inside.pages.filter((_, j) => j !== i) })}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Section>

                    <Section number={7} title="Who is this book for?" hint="Dark section with a tick list.">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Heading" value={audience.heading} onChange={v => patch("audience", { heading: v })} placeholder="Who is this book for?" />
                            <Field label="Line above the list" value={audience.lead} onChange={v => patch("audience", { lead: v })} placeholder="This book is ideal for:" />
                        </div>
                        <StringList label="Readers" items={audience.items} onChange={items => patch("audience", { items })} placeholder="e.g. ACCA students preparing for Audit & Assurance" addLabel="Add reader" />
                        <p className="text-xs text-gray-500 bg-white border border-gray-200 rounded p-2">
                            The author profile, KC GlobEd numbers and Amazon reviews come next. They are the same on every book page.
                        </p>
                    </Section>

                    <Section number={8} title="What you get" hint="Tick list with the price and a Buy button.">
                        <Field label="Heading" value={what_you_get.heading} onChange={v => patch("what_you_get", { heading: v })} placeholder="Your … Study Companion" />
                        <StringList label="Items" items={what_you_get.items} onChange={items => patch("what_you_get", { items })} placeholder="e.g. 376-page book" addLabel="Add item" />
                    </Section>

                    <Section number={9} title="Product details" hint="Product photo next to a price card. Publisher, pages, language and ISBN are filled automatically.">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Heading" value={details.heading} onChange={v => patch("details", { heading: v })} placeholder="ACCA Audit & Assurance" />
                            <Field label="Line above the price" value={details.summary} onChange={v => patch("details", { summary: v })} placeholder="376-page subject resource" />
                        </div>
                        <ImageInput
                            label="Product photo"
                            hint="Square photo of the book (about 1200 × 1200 px)."
                            {...imageProps("details", details.image, url => patch("details", { image: url }))}
                        />
                    </Section>

                    <Section number={10} title="FAQ" hint="Questions and answers.">
                        <div className="space-y-3">
                            {faq.map((item, i) => (
                                <div key={i} className="flex gap-2 items-start p-3 border border-gray-200 rounded-md bg-gray-50">
                                    <span className="w-6 pt-2 text-xs text-gray-500 text-right">{i + 1}.</span>
                                    <div className="flex-1 space-y-2">
                                        <input value={item.question} onChange={e => editFaq(i, { question: e.target.value })} placeholder="Question" className={inputClass} />
                                        <textarea rows={2} value={item.answer} onChange={e => editFaq(i, { answer: e.target.value })} placeholder="Answer" className={inputClass} />
                                    </div>
                                    <RowButtons
                                        index={i}
                                        length={faq.length}
                                        onMove={to => onChange(prev => ({ ...prev, faq: moveItem(prev.faq, i, to) }))}
                                        onRemove={() => onChange(prev => ({ ...prev, faq: prev.faq.filter((_, j) => j !== i) }))}
                                    />
                                </div>
                            ))}
                        </div>
                        <button type="button" className={addButton} onClick={() => onChange(prev => ({ ...prev, faq: [...prev.faq, { question: "", answer: "" }] }))}>+ Add question</button>
                    </Section>

                    <Section number={11} title="Closing banner" hint="Purple section at the end with the price and a Buy button.">
                        <Field label="Heading" value={final.heading} onChange={v => patch("final", { heading: v })} placeholder="Ready to Take the Next Step in Your Preparation?" />
                        <Field label="Text" textarea value={final.text} onChange={v => patch("final", { text: v })} />
                    </Section>

                    <Section number={12} title="SEO and purchase bar" hint="Browser tab title, Google description and the name in the sticky Buy bar.">
                        <Field label="Page title (browser tab and Google)" value={value.meta_title} onChange={v => onChange(prev => ({ ...prev, meta_title: v }))} placeholder="ACCA Audit & Assurance Study Book | KC GlobEd" />
                        <Field label="Google description" textarea value={value.meta_description} onChange={v => onChange(prev => ({ ...prev, meta_description: v }))} />
                        <Field label="Short book name (sticky Buy bar)" value={value.short_name} onChange={v => onChange(prev => ({ ...prev, short_name: v }))} placeholder="ACCA Audit & Assurance Book" />
                    </Section>
                </>
            )}
        </div>
    );
};

export default LandingPageFields;

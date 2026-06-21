import { useEffect, useMemo, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import icon from "../assets/icon_noback.png";
import policyMarkdown from "../assets/POLICY.md?raw";
import termsMarkdown from "../assets/TERMS.md?raw";
import { supabase } from "./supabase";

const appStoreUrl = "https://apps.apple.com/us/search?term=Lullby";

type Feature = {
    id: string;
    title: string;
    text: string;
    icon: keyof typeof MaterialIcons.glyphMap;
};

type MarkdownBlock =
    | { type: "h1" | "h2" | "h3" | "p"; text: string }
    | { type: "list"; items: string[] };

type PresetLookupState =
    | { status: "idle"; name: null; message: null }
    | { status: "loading"; name: null; message: null }
    | { status: "ready"; name: string; message: null }
    | { status: "unavailable"; name: null; message: string };

const features: Feature[] = [
    {
        id: "sounds",
        title: "Layer ambient sounds",
        text: "Blend calming textures into a sleep environment that feels personal and consistent.",
        icon: "graphic-eq",
    },
    {
        id: "routine",
        title: "Save your night routine",
        text: "Keep favorite mixes ready so winding down takes a few quiet taps.",
        icon: "bookmark",
    },
    {
        id: "timer",
        title: "Sleep timers",
        text: "Let Lullby fade into the background while your night settles.",
        icon: "timer",
    },
    {
        id: "calm",
        title: "Premium calm",
        text: "Designed with a dark, minimal interface that stays out of the way.",
        icon: "nightlight",
    },
];

export default function App() {
    const route = window.location.pathname;
    let page: React.ReactNode;

    if (route === "/privacy") {
        page = <LegalPage markdown={policyMarkdown} title="Privacy Policy" />;
    } else if (route === "/terms") {
        page = <LegalPage markdown={termsMarkdown} title="Terms of Service" />;
    } else if (route === "/preset") {
        page = <PresetPage />;
    } else {
        page = <LandingPage />;
    }

    return page;
}

function LandingPage() {
    return (
        <main className="site-shell">
            <div className="landing-main">
                <section className="landing-hero">
                    <div className="hero-content">
                        <div className="hero-mark" aria-hidden="true">
                            <img src={icon} alt="" />
                        </div>

                        <div className="hero-copy">
                            <h1>Create a calmer way to fall asleep.</h1>
                            <p className="lead">
                                Lullby helps you build a quiet night routine
                                with layered ambient sound, saved mixes, gentle
                                timers, and a focused interface made for rest.
                            </p>
                        </div>

                        <div
                            className="store-actions"
                            aria-label="Download Lullby"
                        >
                            <a
                                className="store-link app-store-link"
                                href={appStoreUrl}
                            >
                                <span className="apple-icon" aria-hidden="true">
                                    <MaterialIcons
                                        name="apple"
                                        size={28}
                                        color="currentColor"
                                    />
                                </span>
                                <span>
                                    <span className="store-kicker">
                                        Download on the
                                    </span>
                                    <span className="store-name">
                                        App Store
                                    </span>
                                </span>
                            </a>
                        </div>
                    </div>

                    <FeatureTabs />
                </section>
            </div>

            <SiteFooter />
        </main>
    );
}

function FeatureTabs() {
    const [activeId, setActiveId] = useState(features[0].id);
    const activeFeature =
        features.find((feature) => feature.id === activeId) ?? features[0];

    return (
        <section className="feature-tabs" aria-label="Lullby highlights">
            <div
                className="tab-list"
                role="tablist"
                aria-label="Feature highlights"
            >
                {features.map((feature) => {
                    const isActive = feature.id === activeId;

                    return (
                        <button
                            aria-controls={`panel-${feature.id}`}
                            aria-selected={isActive}
                            className="feature-tab"
                            id={`tab-${feature.id}`}
                            key={feature.id}
                            onClick={() => setActiveId(feature.id)}
                            role="tab"
                            type="button"
                        >
                            <span className="tab-icon" aria-hidden="true">
                                <MaterialIcons
                                    name={feature.icon}
                                    size={24}
                                    color="currentColor"
                                />
                            </span>
                            <span>{feature.title}</span>
                        </button>
                    );
                })}
            </div>

            <article
                aria-labelledby={`tab-${activeFeature.id}`}
                className="feature-panel"
                id={`panel-${activeFeature.id}`}
                role="tabpanel"
            >
                <span className="panel-icon" aria-hidden="true">
                    <MaterialIcons
                        name={activeFeature.icon}
                        size={32}
                        color="currentColor"
                    />
                </span>
                <h2>{activeFeature.title}</h2>
                <p>{activeFeature.text}</p>
            </article>
        </section>
    );
}

function PresetPage() {
    const presetId =
        new URLSearchParams(window.location.search).get("id") ?? "";
    const [presetLookup, setPresetLookup] = useState<PresetLookupState>({
        status: "idle",
        name: null,
        message: null,
    });
    const appLink = presetId
        ? `lullby://shared-preset?id=${encodeURIComponent(presetId)}`
        : "lullby://shared-preset";
    const presetLabel =
        presetLookup.status === "ready"
            ? presetLookup.name
            : presetLookup.status === "loading"
              ? "Loading preset..."
              : "Shared Lullby preset";

    useEffect(() => {
        let isMounted = true;

        async function loadPresetName() {
            if (!presetId) {
                setPresetLookup({
                    status: "unavailable",
                    name: null,
                    message: "This link is missing a preset ID.",
                });
                return;
            }

            if (!supabase) {
                setPresetLookup({
                    status: "unavailable",
                    name: null,
                    message: "Preset details are unavailable right now.",
                });
                return;
            }

            setPresetLookup({ status: "loading", name: null, message: null });

            const controller = new AbortController();
            const timeout = window.setTimeout(() => controller.abort(), 5000);
            const { data, error } = await supabase
                .from("presets")
                .select("name")
                .eq("id", presetId)
                .abortSignal(controller.signal)
                .maybeSingle();
            window.clearTimeout(timeout);

            if (!isMounted) {
                return;
            }

            if (error || !data?.name) {
                setPresetLookup({
                    status: "unavailable",
                    name: null,
                    message: "Preset details are unavailable right now.",
                });
                return;
            }

            setPresetLookup({
                status: "ready",
                name: data.name,
                message: null,
            });
        }

        void loadPresetName();

        return () => {
            isMounted = false;
        };
    }, [presetId]);

    return (
        <main className="site-shell">
            <section className="preset-hero">
                <div className="preset-card">
                    <img className="preset-icon" src={icon} alt="" />
                    <p className="eyebrow preset-name">{presetLabel}</p>
                    <h1 className="preset-title">Open this preset in Lullby</h1>
                    {presetLookup.message ? (
                        <p className="preset-status">{presetLookup.message}</p>
                    ) : null}

                    <div className="preset-meta">
                        <span>Preset ID</span>
                        <strong>{presetId || "Missing from link"}</strong>
                    </div>

                    <div className="actions centered-actions">
                        <a className="button primary" href={appLink}>
                            Open in Lullby
                        </a>
                        <a className="button ghost" href="/">
                            Get Lullby
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}

function LegalPage({ markdown, title }: { markdown: string; title: string }) {
    const blocks = useMemo(() => parseMarkdown(markdown), [markdown]);

    return (
        <main className="site-shell">
            <header className="legal-header">
                <a className="back-link" href="/">
                    Lullby
                </a>
                <a href={title === "Privacy Policy" ? "/terms" : "/privacy"}>
                    {title === "Privacy Policy" ? "Terms" : "Privacy"}
                </a>
            </header>

            <article className="legal-document">
                <MarkdownBlocks blocks={blocks} />
            </article>
        </main>
    );
}

function SiteFooter() {
    return (
        <footer className="site-footer">
            <div>
                <p className="footer-brand">1.0.0 © 2026 Lullby</p>
                <a href="mailto:mckyzcky@gmail.com">mckyzcky@gmail.com</a>
            </div>

            <nav className="footer-links" aria-label="Legal links">
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
            </nav>
        </footer>
    );
}

function parseMarkdown(markdown: string): MarkdownBlock[] {
    const blocks: MarkdownBlock[] = [];
    const lines = markdown.split(/\r?\n/);
    let listItems: string[] = [];
    let foundTitle = false;

    function flushList() {
        if (listItems.length > 0) {
            blocks.push({ type: "list", items: listItems });
            listItems = [];
        }
    }

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed || trimmed === "---") {
            flushList();
            continue;
        }

        if (trimmed.startsWith("- ")) {
            listItems.push(trimmed.slice(2));
            continue;
        }

        flushList();

        if (trimmed.startsWith("### ")) {
            blocks.push({ type: "h3", text: trimmed.slice(4) });
        } else if (trimmed.startsWith("## ")) {
            blocks.push({ type: "h2", text: trimmed.slice(3) });
        } else if (trimmed.startsWith("# ")) {
            blocks.push({
                type: foundTitle ? "h2" : "h1",
                text: trimmed.slice(2),
            });
            foundTitle = true;
        } else {
            blocks.push({ type: "p", text: trimmed });
        }
    }

    flushList();
    return blocks;
}

function MarkdownBlocks({ blocks }: { blocks: MarkdownBlock[] }) {
    return blocks.map((block, index) => {
        if (block.type === "h1") {
            return <h1 key={index}>{renderInline(block.text)}</h1>;
        }

        if (block.type === "h2") {
            return <h2 key={index}>{renderInline(block.text)}</h2>;
        }

        if (block.type === "h3") {
            return <h3 key={index}>{renderInline(block.text)}</h3>;
        }

        if (block.type === "list") {
            return (
                <ul key={index}>
                    {block.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{renderInline(item)}</li>
                    ))}
                </ul>
            );
        }

        return <p key={index}>{renderInline(block.text)}</p>;
    });
}

function renderInline(text: string) {
    const parts: React.ReactNode[] = [];
    const strongPattern = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;

    for (const match of text.matchAll(strongPattern)) {
        if (match.index === undefined) {
            continue;
        }

        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        parts.push(
            <strong key={`${match.index}-${match[1]}`}>{match[1]}</strong>,
        );
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
}

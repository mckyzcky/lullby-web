const loadedFonts = new Set<string>();

export function isLoaded(fontName: string) {
    return loadedFonts.has(fontName);
}

export async function loadAsync(fonts: Record<string, unknown>) {
    await Promise.all(
        Object.entries(fonts).map(async ([fontName, source]) => {
            if (loadedFonts.has(fontName)) {
                return;
            }

            const url = getFontUrl(source);

            if (url && "FontFace" in window) {
                const fontFace = new FontFace(fontName, `url(${url})`);
                await fontFace.load();
                document.fonts.add(fontFace);
            } else if (url) {
                const style = document.createElement("style");
                style.textContent = `@font-face { font-family: "${fontName}"; src: url("${url}") format("truetype"); font-weight: normal; font-style: normal; }`;
                document.head.appendChild(style);
            }

            loadedFonts.add(fontName);
        }),
    );
}

export async function renderToImageAsync() {
    return null;
}

function getFontUrl(source: unknown) {
    if (typeof source === "string") {
        return source;
    }

    if (source && typeof source === "object" && "uri" in source) {
        const uri = (source as { uri?: unknown }).uri;
        return typeof uri === "string" ? uri : null;
    }

    return null;
}

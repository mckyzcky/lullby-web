import Image from "next/image";
import Link from "next/link";

const title = "Open this preset in Lullby";
const description = "Play this sleep sound mix in Lullby.";
const siteUrl = "https://lullby.mckyzcky.com";

function getPresetId(searchParams) {
  const value = searchParams?.id;

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return typeof value === "string" ? value : "";
}

function getPresetUrl(presetId) {
  const url = new URL("/preset", siteUrl);

  if (presetId) {
    url.searchParams.set("id", presetId);
  }

  return url.toString();
}

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const presetId = getPresetId(resolvedSearchParams);
  const url = getPresetUrl(presetId);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: "/icon.png",
          width: 1200,
          height: 1200,
          alt: "Lullby app icon",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/icon.png"],
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/icon.png",
    },
  };
}

export default async function LullbyPresetPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const presetId = getPresetId(resolvedSearchParams);

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <div className="brand" aria-label="Lullby">
            <Image
              className="brand-icon"
              src="/icon.png"
              alt=""
              width={96}
              height={96}
              priority
            />
            <span>Lullby</span>
          </div>

          <span className="eyebrow">
            <span className="spark" />
            Shared preset
          </span>

          <div>
            <h1 className="preset-title">{title}</h1>
            <p className="lead">{description}</p>
          </div>

          <p className="subcopy">
            {presetId ? (
              <>
                Preset ID: <span className="preset-id">{presetId}</span>
              </>
            ) : (
              "This preview page is configured for shared preset links with an id query parameter."
            )}
          </p>

          <div className="actions">
            <a
              className="button primary"
              href={
                presetId
                  ? `lullby://shared-preset?id=${encodeURIComponent(presetId)}`
                  : "lullby://shared-preset"
              }
            >
              Open in Lullby
            </a>
            <Link className="button ghost" href="/">
              About Lullby
            </Link>
          </div>
        </div>

        <div className="device" aria-hidden="true">
          <div className="phone">
            <div className="screen">
              <div className="screen-top">
                <span>Shared mix</span>
                <span>Ready</span>
              </div>

              <div className="mix-card">
                <h2>Sleep preset</h2>
                {[
                  ["Rain", "72%"],
                  ["Waves", "58%"],
                  ["Forest", "46%"],
                ].map(([name, width]) => (
                  <div className="sound-row" key={name}>
                    <div className="sound-label">
                      <span>{name}</span>
                      <span>{width}</span>
                    </div>
                    <div className="bar">
                      <div className="fill" style={{ width }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="sound-grid">
                {["Rain", "Waves", "Wind", "Forest"].map((name) => (
                  <div className="tile" key={name}>
                    <span className="glyph" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

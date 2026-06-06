import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Lullby",
  description: "A calm sleep sound mixer for iOS and Android.",
};

const sounds = [
  ["Rain", "78%"],
  ["Forest", "52%"],
  ["Waves", "64%"],
];

export default function LullbyLandingPage() {
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
            Sleep sound mixer
          </span>

          <div>
            <h1>Build the sound of sleep.</h1>
            <p className="lead">
              Layer rain, waves, wind, and quiet forest textures into a calm mix
              that helps your night settle faster.
            </p>
          </div>

          <p className="subcopy">
            Lullby is coming soon for iOS and Android, with shared presets for
            passing your favorite sleep mixes to someone else.
          </p>

          <div className="actions">
            <Link className="button primary" href="/preset?id=preview">
              Preview shared preset
            </Link>
            <span className="button ghost">Coming soon</span>
          </div>
        </div>

        <DevicePreview title="Midnight drift" sounds={sounds} />
      </section>
    </main>
  );
}

function DevicePreview({ title, sounds: previewSounds }) {
  return (
    <div className="device" aria-hidden="true">
      <div className="phone">
        <div className="screen">
          <div className="screen-top">
            <span>Lullby</span>
            <span>15 min</span>
          </div>

          <div className="mix-card">
            <h2>{title}</h2>
            {previewSounds.map(([name, width]) => (
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
  );
}

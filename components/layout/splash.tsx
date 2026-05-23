export function Splash() {
  return (
    <div className="pix-splash" aria-hidden="true">
      <div className="pix-splash-stack">
        <div className="relative grid place-items-center">
          <span className="pix-splash-halo" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/LogoWihtoutText.png"
            alt=""
            width={96}
            height={96}
            className="pix-splash-logo"
          />
        </div>
        <span className="pix-splash-wordmark">Pixuntra</span>
        <span className="pix-splash-bar" />
      </div>
    </div>
  );
}

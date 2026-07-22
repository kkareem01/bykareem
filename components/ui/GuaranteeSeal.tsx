/**
 * Gold "100% satisfaction" seal — award-sticker style badge for the
 * guarantee section. Pure inline SVG so it scales crisp and picks up
 * the brand gold/hunter palette without an image asset.
 */
export function GuaranteeSeal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="100% satisfaction guarantee seal"
    >
      <defs>
        <linearGradient id="seal-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7ecc0" />
          <stop offset="35%" stopColor="#e3c878" />
          <stop offset="70%" stopColor="#b8912e" />
          <stop offset="100%" stopColor="#96731f" />
        </linearGradient>
        <linearGradient id="seal-gold-center" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#f7ecc0" />
          <stop offset="55%" stopColor="#e3c878" />
          <stop offset="100%" stopColor="#c9a227" />
        </linearGradient>
        {/* text baselines for the curved labels */}
        <path id="seal-arc-top" d="M 42,100 A 58,58 0 0 1 158,100" fill="none" />
        <path id="seal-arc-bottom" d="M 31,100 A 69,69 0 0 0 169,100" fill="none" />
      </defs>

      {/* serrated stamp edge */}
      <polygon
        fill="url(#seal-gold)"
        points="100.0,2.0 106.0,8.7 112.8,2.8 117.9,10.3 125.4,5.3 129.4,13.4 137.5,9.5 140.5,17.9 149.0,15.1 150.8,23.9 159.7,22.3 160.3,31.2 169.3,30.7 168.8,39.7 177.7,40.3 176.1,49.2 184.9,51.0 182.1,59.5 190.5,62.5 186.6,70.6 194.7,74.6 189.7,82.1 197.2,87.2 191.3,94.0 198.0,100.0 191.3,106.0 197.2,112.8 189.7,117.9 194.7,125.4 186.6,129.4 190.5,137.5 182.1,140.5 184.9,149.0 176.1,150.8 177.7,159.7 168.8,160.3 169.3,169.3 160.3,168.8 159.7,177.7 150.8,176.1 149.0,184.9 140.5,182.1 137.5,190.5 129.4,186.6 125.4,194.7 117.9,189.7 112.8,197.2 106.0,191.3 100.0,198.0 94.0,191.3 87.2,197.2 82.1,189.7 74.6,194.7 70.6,186.6 62.5,190.5 59.5,182.1 51.0,184.9 49.2,176.1 40.3,177.7 39.7,168.8 30.7,169.3 31.2,160.3 22.3,159.7 23.9,150.8 15.1,149.0 17.9,140.5 9.5,137.5 13.4,129.4 5.3,125.4 10.3,117.9 2.8,112.8 8.7,106.0 2.0,100.0 8.7,94.0 2.8,87.2 10.3,82.1 5.3,74.6 13.4,70.6 9.5,62.5 17.9,59.5 15.1,51.0 23.9,49.2 22.3,40.3 31.2,39.7 30.7,30.7 39.7,31.2 40.3,22.3 49.2,23.9 51.0,15.1 59.5,17.9 62.5,9.5 70.6,13.4 74.6,5.3 82.1,10.3 87.2,2.8 94.0,8.7"
      />
      <circle cx="100" cy="100" r="88" fill="url(#seal-gold)" />
      <circle cx="100" cy="100" r="84" fill="none" stroke="#f7ecc0" strokeWidth="1.5" opacity="0.7" />

      {/* dark band with curved labels */}
      <circle cx="100" cy="100" r="80" fill="#142b21" />
      <text
        fill="#e3c878"
        fontSize="15"
        fontWeight="700"
        letterSpacing="3.5"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <textPath href="#seal-arc-top" startOffset="50%" textAnchor="middle">
          SATISFACTION
        </textPath>
      </text>
      <text
        fill="#e3c878"
        fontSize="15"
        fontWeight="700"
        letterSpacing="4"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <textPath href="#seal-arc-bottom" startOffset="50%" textAnchor="middle">
          GUARANTEE
        </textPath>
      </text>
      {/* side stars */}
      <path
        d="M 0,-6 L 1.8,-1.8 L 6,-1.4 L 2.9,1.5 L 3.7,5.7 L 0,3.4 L -3.7,5.7 L -2.9,1.5 L -6,-1.4 L -1.8,-1.8 Z"
        fill="#e3c878"
        transform="translate(28,100)"
      />
      <path
        d="M 0,-6 L 1.8,-1.8 L 6,-1.4 L 2.9,1.5 L 3.7,5.7 L 0,3.4 L -3.7,5.7 L -2.9,1.5 L -6,-1.4 L -1.8,-1.8 Z"
        fill="#e3c878"
        transform="translate(172,100)"
      />

      {/* gold center disc */}
      <circle cx="100" cy="100" r="52" fill="url(#seal-gold-center)" />
      <circle cx="100" cy="100" r="48" fill="none" stroke="#96731f" strokeWidth="1" opacity="0.5" />
      <text
        x="100"
        y="103"
        textAnchor="middle"
        fill="#142b21"
        fontSize="34"
        fontWeight="800"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        100%
      </text>
      <text
        x="100"
        y="124"
        textAnchor="middle"
        fill="#142b21"
        fontSize="11"
        fontWeight="700"
        letterSpacing="2"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        LOVE IT
      </text>
    </svg>
  );
}

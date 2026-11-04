import { writeFileSync, readFileSync } from 'node:fs';
const root = new URL('../public/', import.meta.url);
const palettes = {
  champagne: ['#e7decb','#b8a589','#f5ebd7','#a28b6d','#cec0a5'],
  graphite: ['#555a53','#272d28','#84887e','#20251f','#4a5047'],
  pearl: ['#fcf8eb','#c9c6b9','#ffffff','#aba99e','#e7e3d5']
};
for (const [name,p] of Object.entries(palettes)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="900" viewBox="0 0 800 900" fill="none">
<defs>
<linearGradient id="body" x1="400" y1="210" x2="400" y2="400" gradientUnits="userSpaceOnUse"><stop stop-color="${p[3]}"/><stop offset=".15" stop-color="${p[0]}"/><stop offset=".3" stop-color="${p[2]}"/><stop offset=".56" stop-color="${p[0]}"/><stop offset=".82" stop-color="${p[1]}"/><stop offset="1" stop-color="${p[3]}"/></linearGradient>
<linearGradient id="handle" x1="337" y1="550" x2="462" y2="550" gradientUnits="userSpaceOnUse"><stop stop-color="${p[3]}"/><stop offset=".2" stop-color="${p[0]}"/><stop offset=".39" stop-color="${p[2]}"/><stop offset=".7" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient>
<linearGradient id="edge" x1="570" y1="220" x2="650" y2="395" gradientUnits="userSpaceOnUse"><stop stop-color="${p[2]}"/><stop offset=".6" stop-color="${p[1]}"/><stop offset="1" stop-color="${p[3]}"/></linearGradient>
<radialGradient id="vent"><stop stop-color="#30342e"/><stop offset=".9" stop-color="#181d18"/><stop offset="1" stop-color="#35392f"/></radialGradient>
<filter id="shadow" x="-80%" y="-250%" width="260%" height="600%"><feGaussianBlur stdDeviation="20"/></filter>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
<pattern id="brush" width="5" height="2" patternUnits="userSpaceOnUse"><path d="M0 .5H5" stroke="#fff" stroke-opacity=".11" stroke-width=".35"/></pattern>
<pattern id="grille" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.5" fill="#0d120f"/><circle cx="3.5" cy="3.6" r="1.1" fill="#444a40"/></pattern>
<clipPath id="frontClip"><ellipse cx="598" cy="308" rx="46" ry="77"/></clipPath>
</defs>
<ellipse cx="407" cy="785" rx="174" ry="19" fill="#61523f" opacity=".20" filter="url(#shadow)"/>
<g transform="rotate(-24 420 440)">
<path d="M401 700C402 737 421 758 455 768C491 779 532 779 548 803" stroke="#30352e" stroke-width="8" stroke-linecap="round"/>
<path d="M402 700C403 737 422 758 456 768C492 779 532 779 548 803" stroke="#777465" stroke-width="1.2" stroke-linecap="round"/>
<path d="M344 345C346 325 370 319 401 322C435 325 455 337 454 359L452 667C451 693 429 714 401 713C373 712 350 693 349 668L344 345Z" fill="url(#handle)"/>
<path d="M344 345C346 325 370 319 401 322C435 325 455 337 454 359L452 667C451 693 429 714 401 713C373 712 350 693 349 668L344 345Z" fill="url(#brush)"/>
<path d="M349 637L452 639V666C452 692 429 713 401 713C373 712 350 693 349 668Z" fill="#32382f"/>
<path d="M351 638L451 640" stroke="${p[2]}" stroke-width="2"/>
${Array.from({length:13},(_,i)=>`<path d="M${356+i*7} 648V${689+11*Math.sin(i/12*Math.PI)}" stroke="#6d7062" stroke-opacity=".65" stroke-width="1.5"/>`).join('')}
<path d="M367 412L366 624" stroke="${p[2]}" stroke-opacity=".5" stroke-width="1.8"/>
<rect x="399" y="430" width="24" height="80" rx="12" fill="#7d7765" opacity=".6"/>
<rect x="400" y="431" width="22" height="78" rx="11" fill="#423f35"/>
<rect x="403" y="434" width="16" height="28" rx="8" fill="${p[0]}"/>
<circle cx="411" cy="491" r="5" stroke="${p[0]}" stroke-width=".8"/>
<path d="M411 484V490" stroke="${p[0]}" stroke-width=".9"/>
<circle cx="411" cy="528" r="2" fill="#d9e2c2"/>
<text x="407" y="596" transform="rotate(-90 407 596)" fill="#574d3f" font-family="Arial,sans-serif" font-size="9" letter-spacing="3.4">AERLOR</text>
<path d="M252 219C229 219 209 259 209 307C209 357 230 398 254 398L598 395L598 220L252 219Z" fill="url(#body)"/>
<path d="M252 219C229 219 209 259 209 307C209 357 230 398 254 398L598 395L598 220L252 219Z" fill="url(#brush)"/>
<ellipse cx="250" cy="308" rx="45" ry="90" fill="url(#edge)"/>
<ellipse cx="247" cy="308" rx="34" ry="77" fill="#49493c"/>
<ellipse cx="245" cy="308" rx="29" ry="72" fill="url(#grille)"/>
<path d="M253 224L589 224" stroke="${p[2]}" stroke-opacity=".75"/>
<path d="M271 237L568 237" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
<path d="M277 393L592 391" stroke="${p[3]}" stroke-opacity=".75"/>
<ellipse cx="597" cy="308" rx="56" ry="88" fill="url(#edge)"/>
<ellipse cx="598" cy="308" rx="48" ry="79" fill="url(#vent)"/>
<g clip-path="url(#frontClip)">
<ellipse cx="595" cy="308" rx="43" ry="74" fill="url(#grille)"/>
${Array.from({length:8},(_,i)=>`<path d="M550 ${250+i*16}H644" stroke="#747365" stroke-opacity=".5" stroke-width="1.1"/>`).join('')}
<ellipse cx="598" cy="307" rx="13" ry="25" fill="#383e32" stroke="#676d5b" stroke-width="1.5"/>
</g>
<ellipse cx="598" cy="308" rx="50" ry="82" stroke="${p[2]}" stroke-opacity=".7" stroke-width="1.2"/>
<text x="390" y="302" fill="#675d4b" font-family="Arial,sans-serif" font-size="10" letter-spacing="4">AERLOR</text>
<text x="432" y="320" fill="#675d4b" font-family="Arial,sans-serif" font-size="5.5" letter-spacing="2">${name==='pearl'?'LITE':'PRO'}</text>
</g></svg>`;
  writeFileSync(new URL(`images/dryer-${name}.svg`,root),svg);
}
writeFileSync(new URL('favicon.svg',root),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#30362f"/><path d="M17 47L31 15H34L48 47H43L39 37H25L21 47ZM27 32H37L32 20Z" fill="#eee5d3"/></svg>`);
writeFileSync(new URL('images/morning-ritual.svg',root),`<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1080" viewBox="0 0 1440 1080" fill="none"><defs>
<linearGradient id="wall" x1="0" y1="0" x2="1290" y2="1080" gradientUnits="userSpaceOnUse"><stop stop-color="#6a6c56"/><stop offset=".38" stop-color="#a8a58b"/><stop offset=".75" stop-color="#d4c9ad"/><stop offset="1" stop-color="#8a8168"/></linearGradient>
<linearGradient id="stone" x1="0" y1="660" x2="1100" y2="1000" gradientUnits="userSpaceOnUse"><stop stop-color="#d7c8a7"/><stop offset=".3" stop-color="#e5d8bc"/><stop offset=".65" stop-color="#a99e80"/><stop offset="1" stop-color="#cec0a1"/></linearGradient>
<linearGradient id="mirror" x1="800" y1="50" x2="1200" y2="680" gradientUnits="userSpaceOnUse"><stop stop-color="#a7ad96"/><stop offset=".45" stop-color="#c3c6ac"/><stop offset="1" stop-color="#e5d3b3"/></linearGradient>
<linearGradient id="sink" x1="950" y1="680" x2="950" y2="900" gradientUnits="userSpaceOnUse"><stop stop-color="#eee3c9"/><stop offset=".16" stop-color="#e2d3b4"/><stop offset=".68" stop-color="#b4a37f"/><stop offset="1" stop-color="#8e805f"/></linearGradient>
<linearGradient id="inside" x1="900" y1="660" x2="1000" y2="790" gradientUnits="userSpaceOnUse"><stop stop-color="#786e53"/><stop offset=".7" stop-color="#cdbf9d"/><stop offset="1" stop-color="#f1e5c9"/></linearGradient>
<linearGradient id="brass"><stop stop-color="#635c45"/><stop offset=".35" stop-color="#d0bb87"/><stop offset=".48" stop-color="#ebd9a9"/><stop offset=".6" stop-color="#a18b5a"/><stop offset="1" stop-color="#6b5c3b"/></linearGradient>
<radialGradient id="shade"><stop stop-color="#302f24" stop-opacity=".6"/><stop offset="1" stop-color="#302f24" stop-opacity="0"/></radialGradient>
<pattern id="grain" width="160" height="160" patternUnits="userSpaceOnUse"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="160" height="160" filter="url(#noise)" opacity=".13"/></pattern>
<filter id="blur"><feGaussianBlur stdDeviation="20"/></filter><filter id="blurSmall"><feGaussianBlur stdDeviation="5"/></filter>
<clipPath id="mirrorClip"><rect x="659" y="-70" width="550" height="700" rx="270"/></clipPath>
<pattern id="cloth" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 0H6M0 3H6" stroke="#d8d0b7" stroke-width="1" opacity=".6"/></pattern>
</defs>
<rect width="1440" height="1080" fill="url(#wall)"/>
<path d="M0 0H520L0 728Z" fill="#454b38" opacity=".32"/><path d="M-20 240L670 -20H790L-20 500Z" fill="#f3db9e" opacity=".24"/><path d="M0 560L650 90L685 115L0 610Z" fill="#333e26" opacity=".18"/>
<rect width="1440" height="1080" fill="url(#grain)" opacity=".5"/>
<rect x="648" y="-78" width="575" height="722" rx="283" fill="#383d2d" opacity=".25" filter="url(#blur)"/>
<rect x="651" y="-78" width="566" height="716" rx="280" fill="url(#brass)"/><rect x="659" y="-70" width="550" height="700" rx="270" fill="url(#mirror)"/>
<g clip-path="url(#mirrorClip)"><path d="M710 0H980V580H710Z" fill="#b1b8a0"/><path d="M710 0H750V600H710ZM905 0H925V600H905ZM710 210H990V230H710Z" fill="#5b624c" opacity=".7"/><path d="M980 0H1210V650H980Z" fill="#d8d0b1"/><path d="M1000 0L1070 650H1010L950 0Z" fill="#eff0da" opacity=".28"/><path d="M685 580C760 450 785 420 810 315C790 442 876 430 877 580M778 520C704 457 721 417 699 379M806 434C880 367 877 332 902 302" stroke="#596443" stroke-width="7"/><path d="M800 418C745 419 732 376 746 349C785 355 809 385 800 418ZM814 448C858 394 896 424 902 450C871 472 838 472 814 448ZM779 522C729 510 711 474 720 451C766 453 789 484 779 522Z" fill="#61704c"/><path d="M663 600H1209V650H663Z" fill="#afa88d"/></g>
<path d="M0 683L1440 646V735L0 793Z" fill="url(#stone)"/><path d="M0 793L1440 735V1080H0Z" fill="#a29679"/><path d="M0 802L1440 747V1080H0Z" fill="url(#stone)" opacity=".48"/>
<path d="M0 894L1440 843M0 1030L1440 970" stroke="#746b53" opacity=".13" stroke-width="3"/><path d="M50 800C267 896 344 733 555 815S853 930 1060 820S1220 858 1440 795M0 923C230 863 255 974 480 920S830 969 1020 884S1310 954 1440 920" stroke="#ede0bc" opacity=".13" stroke-width="8"/>
<rect y="650" width="1440" height="430" fill="url(#grain)" opacity=".5"/>
<ellipse cx="1017" cy="840" rx="345" ry="65" fill="url(#shade)" filter="url(#blurSmall)"/>
<path d="M737 715C743 833 808 876 1013 879C1222 882 1282 823 1295 704Z" fill="url(#sink)"/>
<ellipse cx="1015" cy="709" rx="280" ry="98" fill="#e5d7b7"/><ellipse cx="1015" cy="709" rx="247" ry="78" fill="url(#inside)"/><ellipse cx="1027" cy="747" rx="24" ry="8" fill="#72684e"/><ellipse cx="1027" cy="745" rx="20" ry="6" fill="#afa280"/>
<path d="M1145 633V467C1145 432 1124 421 1104 423H1040V449H1100C1111 449 1118 454 1118 472V633Z" fill="url(#brass)"/><ellipse cx="1131" cy="635" rx="37" ry="9" fill="url(#brass)"/><rect x="1040" y="421" width="15" height="35" rx="4" fill="#b7a06b"/>
<path d="M264 731L604 713L664 771L319 800Z" fill="#f0e7d2"/><path d="M319 800L664 771L669 810L322 842Z" fill="#d9ceb5"/><path d="M266 735L606 717L663 772L319 803Z" fill="url(#cloth)"/><path d="M322 811L670 782" stroke="#b7ae96" stroke-width="1"/><path d="M314 794L318 842" stroke="#e9dfc6" stroke-width="3"/>
<ellipse cx="391" cy="703" rx="145" ry="30" fill="url(#shade)"/>
<g transform="translate(208 438) rotate(-11 150 150)"><path d="M124 117L170 122L167 279Q143 291 125 273Z" fill="url(#brass)"/><path d="M126 259L168 264V279Q143 292 125 273Z" fill="#454a3b"/><rect x="80" y="78" width="173" height="80" rx="34" fill="url(#brass)"/><ellipse cx="252" cy="118" rx="24" ry="39" fill="#bdad85"/><ellipse cx="254" cy="118" rx="19" ry="32" fill="#353b2c"/><path d="M239 102H269M237 111H272M237 120H272M239 129H269M242 138H266" stroke="#8b9079" stroke-width="1"/><text x="126" y="115" fill="#514a37" font-size="6" letter-spacing="2" font-family="Arial,sans-serif">AERLOR</text><path d="M147 285C146 315 184 317 211 325" stroke="#454a3b" stroke-width="3"/></g>
<ellipse cx="142" cy="715" rx="45" ry="13" fill="#454832" opacity=".3"/><rect x="107" y="586" width="70" height="124" rx="10" fill="#b5a780"/><ellipse cx="142" cy="588" rx="35" ry="13" fill="#d2c39e"/><path d="M140 587V534M117 541H145" stroke="url(#brass)" stroke-width="9" stroke-linecap="round"/><rect x="119" y="623" width="46" height="47" fill="#e5d9bb" opacity=".8"/><text x="127" y="645" font-size="5" letter-spacing="1" fill="#6c644a" font-family="Arial,sans-serif">AERLOR</text>
<path d="M-10 40L470 0L0 785Z" fill="#283322" opacity=".16"/><path d="M1370 0H1440V1080H1380Z" fill="#2f3525" opacity=".1"/>
<rect width="1440" height="1080" fill="#796b43" opacity=".06"/>
</svg>`);
const index = new URL('../index.html',import.meta.url);
writeFileSync(index,readFileSync(index,'utf8').replace('<span class="wordmark-dot" aria-hidden="true">®</span>',''));
console.log('Created 5 original SVG assets. No external product photography or third-party trademarks.');

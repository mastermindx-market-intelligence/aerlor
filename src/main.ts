import { buildPilotBrief } from './pilot';
import type { SceneController, Finish } from './scene';

const base = import.meta.env.BASE_URL;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const dialogs = Array.from(document.querySelectorAll<HTMLDialogElement>('dialog'));
const returnFocus = new WeakMap<HTMLDialogElement, HTMLElement>();
const inquiry = document.querySelector<HTMLDialogElement>('#inquiry-dialog')!;
const productDialog = document.querySelector<HTMLDialogElement>('#product-dialog')!;
const privacy = document.querySelector<HTMLDialogElement>('#privacy-dialog')!;
const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle')!;
const mobileMenu = document.querySelector<HTMLElement>('#mobile-menu')!;
const stage = document.querySelector<HTMLElement>('#product-stage')!;
const fallback = document.querySelector<HTMLImageElement>('.hero-fallback')!;
const motionButton = document.querySelector<HTMLButtonElement>('#motion-toggle')!;
let currentFinish: Finish = 'champagne';
let currentProduct: 'pro' | 'lite' = 'pro';
let controller: SceneController | undefined;

function closeMenu(restore = false): void {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  mobileMenu.hidden = true;
  if (restore) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.hidden = !open;
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
window.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileMenu.hidden) closeMenu(true); });
window.matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

function showDialog(dialog: HTMLDialogElement, opener?: HTMLElement): void {
  const focus = opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : undefined);
  if (focus) returnFocus.set(dialog, focus);
  dialog.showModal();
  document.body.classList.add('modal-open');
}
for (const dialog of dialogs) {
  dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (!dialogs.some(d => d.open)) {
      document.body.classList.remove('modal-open');
      const opener = returnFocus.get(dialog);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    }
  });
}
document.querySelectorAll<HTMLButtonElement>('[data-inquiry]').forEach(button => button.addEventListener('click', () => {
  closeMenu();
  showDialog(inquiry, button);
}));
document.querySelector('[data-privacy]')?.addEventListener('click', () => showDialog(privacy));

const productContent = {
  pro: { name:'PREMIUM', image:'champagne', description:'The signature AERLOR expression. A sculpted form and a proposed brushed-metal finish, imagined for properties where every object has a point of view.', rows:[['Expression','Signature'],['Proposed finish','Brushed metal'],['Design studies','Champagne / Graphite'],['Availability','In development']] },
  lite: { name:'LITE', image:'pearl', description:'The essential AERLOR expression. A proposed soft-matte shell and a pared-back silhouette, imagined to make a more considered guest experience accessible to more properties.', rows:[['Expression','Everyday'],['Proposed finish','Soft-matte polymer'],['Design study','Pearl'],['Availability','In development']] }
};
document.querySelectorAll<HTMLButtonElement>('[data-product]').forEach(button => button.addEventListener('click', () => {
  currentProduct = button.dataset.product === 'lite' ? 'lite' : 'pro';
  const data = productContent[currentProduct];
  const title = document.querySelector<HTMLElement>('#product-dialog-title')!;
  title.replaceChildren(document.createTextNode('AERLOR '));
  const em = document.createElement('em'); em.textContent = data.name; title.append(em);
  document.querySelector<HTMLElement>('#detail-description')!.textContent = data.description;
  const image = document.querySelector<HTMLImageElement>('#detail-image')!;
  image.src = `${base}images/dryer-${data.image}.svg`;
  image.alt = `AERLOR ${data.name} original design study`;
  const dl = document.querySelector<HTMLDListElement>('#detail-specs')!;
  dl.replaceChildren();
  for (const [term, value] of data.rows) {
    const row = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
    dt.textContent = term!; dd.textContent = value!; row.append(dt, dd); dl.append(row);
  }
  showDialog(productDialog, button);
}));
document.querySelector('#detail-inquiry')?.addEventListener('click', () => {
  const opener = returnFocus.get(productDialog);
  productDialog.close();
  const choice = document.querySelector<HTMLInputElement>(`#inquiry-form input[name="interest"][value="${currentProduct==='pro'?'PREMIUM':'LITE'}"]`);
  if (choice) choice.checked = true;
  showDialog(inquiry, opener);
});

const form = document.querySelector<HTMLFormElement>('#inquiry-form')!;
const formError = document.querySelector<HTMLElement>('#form-error')!;
form.noValidate = true;
form.addEventListener('submit', event => {
  event.preventDefault();
  const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input[required],select[required]'));
  const invalid = fields.filter(field => !field.validity.valid);
  fields.forEach(field => {
    if (field.validity.valid) { field.removeAttribute('aria-invalid'); field.removeAttribute('aria-describedby'); }
    else { field.setAttribute('aria-invalid', 'true'); field.setAttribute('aria-describedby', 'form-error'); }
  });
  if (invalid.length) {
    formError.textContent = 'Please complete your name, a valid work email, hotel or group, country, and room count before creating a brief.';
    invalid[0]?.focus();
    return;
  }
  formError.textContent = '';
  const data = new FormData(form);
  const brief = buildPilotBrief(Object.fromEntries(Array.from(data.entries(), ([key, value]) => [key, String(value)])));
  const blob = new Blob([brief], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = 'AERLOR-property-pilot-brief.txt';
  document.body.append(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  document.querySelector<HTMLElement>('#form-status')!.textContent = 'Your pilot brief is ready. A text file has been prepared for download. Nothing was sent to AERLOR.';
});
form.addEventListener('input', event => {
  document.querySelector<HTMLElement>('#form-status')!.textContent = '';
  const field = event.target;
  if ((field instanceof HTMLInputElement || field instanceof HTMLSelectElement) && field.validity.valid) {
    field.removeAttribute('aria-invalid'); field.removeAttribute('aria-describedby');
  }
  if (!form.querySelector('[aria-invalid=true]')) formError.textContent = '';
});

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-finish]')) {
  button.addEventListener('click', () => {
    currentFinish = button.dataset.finish as Finish;
    const finishLabel = currentFinish.charAt(0).toUpperCase() + currentFinish.slice(1);
    document.querySelectorAll('[data-finish]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    document.querySelector('#finish-name')!.textContent = finishLabel;
    stage.setAttribute('aria-label', `Interactive AERLOR design concept in ${finishLabel.toLowerCase()}`);
    fallback.src = `${base}images/dryer-${currentFinish}.svg`;
    fallback.alt = `AERLOR original hairdryer design study in ${finishLabel.toLowerCase()}`;
    controller?.setFinish(currentFinish);
  });
}

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
    el.classList.add('will-reveal');
    revealObserver.observe(el);
  });
}

async function enhanceProduct(): Promise<void> {
  const connection = (navigator as Navigator & {connection?: {saveData?: boolean}}).connection;
  if (connection?.saveData || new URLSearchParams(location.search).has('static')) return;
  try {
    const { createProductScene } = await import('./scene');
    controller = await createProductScene(document.querySelector<HTMLElement>('#scene-canvas')!, currentFinish, reducedMotion.matches);
    stage.classList.add('scene-ready');
    stage.dataset.scene = 'ready';
    motionButton.hidden = reducedMotion.matches;
    motionButton.setAttribute('aria-pressed', String(!reducedMotion.matches));
  } catch {
    stage.dataset.scene = 'fallback';
    motionButton.hidden = true;
    // The original local SVG remains usable when WebGL or the enhancement fails.
  }
}
function updateMotionButton(moving: boolean): void {
  motionButton.setAttribute('aria-pressed', String(moving));
  motionButton.replaceChildren(document.createTextNode(moving ? 'Pause movement ' : 'Resume movement '));
  const icon = document.createElement('span'); icon.setAttribute('aria-hidden', 'true'); icon.textContent = moving ? 'Ⅱ' : '▷'; motionButton.append(icon);
  controller?.setMotion(moving);
}
motionButton.addEventListener('click', () => updateMotionButton(motionButton.getAttribute('aria-pressed') !== 'true'));
reducedMotion.addEventListener('change', event => {
  controller?.setMotion(!event.matches);
  motionButton.hidden = event.matches;
  updateMotionButton(!event.matches);
  document.querySelectorAll('.will-reveal').forEach(el => { if (event.matches) el.classList.add('is-visible'); });
});
if ('requestIdleCallback' in window) window.requestIdleCallback(() => { void enhanceProduct(); }, { timeout: 1500 });
else globalThis.setTimeout(() => { void enhanceProduct(); }, 400);
window.addEventListener('pagehide', event => { if (!event.persisted) controller?.dispose(); });

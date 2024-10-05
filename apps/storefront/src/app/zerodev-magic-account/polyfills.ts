import { Buffer } from 'buffer';

// @ts-expect-error type issue
window.Browser = {
    T: () => { }
}
window.global = window.global ?? window;
window.Buffer = window.Buffer ?? Buffer;
window.process = window.process ?? { env: {}, browser: true };

// Define Browser global
export { };
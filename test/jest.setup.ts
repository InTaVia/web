import '@testing-library/jest-dom';
/** Apply built-in polyfills like `fetch`. */
import 'next';

/** @see https://github.com/jsdom/jsdom/issues/1721 */
global.URL.createObjectURL = jest.fn();

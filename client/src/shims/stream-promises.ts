// This is a browser-friendly mock for the Node.js `stream/promises` module.
// The Irys SDK requires this module, but the `pipeline` function is not
// used in a browser environment, so we can provide an empty mock to
// satisfy the dependency during the build process.

export const pipeline = () => {
  console.warn('Node.js `stream/promises.pipeline` is not supported in the browser and has been mocked. If you see this message, the application may not behave as expected.');
}; 
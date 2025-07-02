import "@testing-library/jest-dom";
// commit #26 - Tony

// Mock for reCAPTCHA
window.grecaptcha = {
  ready: (callback) => callback(),
  execute: () => Promise.resolve("test-token"),
};

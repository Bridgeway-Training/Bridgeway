export const simulateRequest = async <T>(response: T, delay = 900, shouldFail = false) =>
  new Promise<T>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      window.clearTimeout(timeout);
      if (shouldFail) {
        reject(new Error('Network error'));
      } else {
        resolve(response);
      }
    }, delay);
  });

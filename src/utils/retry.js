const retry = async (fn, maxAttempts = 5, args) => {
  // Check if args is iterable
  const isIterable = args && typeof args[Symbol.iterator] === "function";
  let result;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Use spread syntax if args is iterable, otherwise pass it as is
      result = await fn(...(isIterable ? args : [args]));
      break; // if the function succeeds, we break out of the loop
    } catch (error) {
      console.log(`Attempt ${attempt + 1} failed. Retrying...`, error);
      if (attempt === maxAttempts - 1) {
        // if it's the last attempt
        console.log("Max attempts reached. Process failed.");
        throw error; // throw the error
      }
      await new Promise((res) => setTimeout(res, 60000)); // wait for 60 seconds before the next retry
    }
  }
  return result;
};

module.exports = retry;

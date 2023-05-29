//A function the is always called for every route call to catch errors and send them
// to error Middleware on {app.js, line 132}

/*
The exported function takes a single argument fn, which is expected to be an async function or a function that returns a promise.

The exported function returns a new middleware function with parameters req, res, and next.

Inside the returned middleware function, the original function fn is called with the req, res, and next arguments.
 The catch method is chained to the promise returned by fn to handle any errors that occur during the execution of fn.

If an error is caught, the next function is called with the error as its argument,
 allowing Express to handle the error through its error-handling middleware.

This higher-order function is useful for wrapping async middleware functions in Express,
 as it allows you to handle promise rejections without having to include a .catch block in every async middleware function.
  To use this exported function,
   you can simply wrap your async middleware functions when defining your routes.
 */
  module.exports = fn => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  }

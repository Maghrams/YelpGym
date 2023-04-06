//A function the is always called for every route call to catch errors and send them
// to error Middleware on {app.js, line 132}
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
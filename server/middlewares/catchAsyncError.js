
export const catchAsyncError = (theFunction) => {
    return (req, res, next) => {
        Promise.resolve(theFunction(req, res, next)).catch(next);  // if there is any error then error middleware will run.
    }
}
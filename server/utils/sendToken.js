
// create function for send token.
// it will accept user data , status code and message
export const sendToken = (user, statusCode, message, res) => {

    const token = user.generateToken();
    res.status(statusCode).cookie("token", token, {
        expire : new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // set day
        httpOnly : true,
    })
    .json({
        success : true,
        message,
        token,
        user
    });
}
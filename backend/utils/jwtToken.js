const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Default to 7 days if COOKIE_EXPIRES is not set
  const cookieExpires = process.env.COOKIE_EXPIRES || 7;

  const options = {
    expires: new Date(Date.now() + cookieExpires * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true, // Send cookie only on HTTPS
    sameSite: "None", // Allow cross-site cookies (required for Vercel frontend to access backend)
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
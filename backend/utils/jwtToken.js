const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,           // Send cookie only on HTTPS
    sameSite: "None",       // Allow cross-site cookies (required for Vercel frontend to access backend)
  };

  res.status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user,
    });
};

module.exports = sendToken;

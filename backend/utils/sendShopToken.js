const sendShopToken = (shop, statusCode, res) => {
  const token = shop.getJwtToken();

  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true,
    sameSite: "none",         // Required for cross-site cookies (e.g., Vercel + localhost)
    secure: true              // Ensures cookie only sent over HTTPS
  };

  res
    .status(statusCode)
    .cookie("shop_token", token, options)
    .json({
      success: true,
      shop,
      token,
    });
};

module.exports = sendShopToken;

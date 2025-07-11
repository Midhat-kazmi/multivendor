const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
     console.log("Token from cookies:", token);

    if (!token) {
      return res.status(401).json({ success: false, message: "No token, please login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("isAuthenticated middleware error:", error.message);
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }
};



exports.isSeller = async (req, res, next) => {
  try {
    const token = req.cookies.shop_token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token, please login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded || !decoded.id) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const shop = await Shop.findById(decoded.id).select("-password");

    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    req.seller = shop
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ success: false, message: "Unauthorized access" });
  }
};


exports.isAdmin = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(`${req.user.role} can not access this resources!`)
        };
        next();
    }
}
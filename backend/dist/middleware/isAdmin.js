"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = async (req, res, next) => {
    const { auth } = req;
    if (auth.userId !== process.env.ADMIN_USER_ID) {
        // check if auth.userId matches admin user in .env
        return res.status(403).json({
            success: false,
            message: "Unauthorized: Admin access required",
        });
    }
    next(); // if match - allow request to continue
};
exports.isAdmin = isAdmin;

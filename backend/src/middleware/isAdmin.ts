import { Request, Response, NextFunction } from "express";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { auth } = req as unknown as { auth: { userId: string } };

  if (auth.userId !== process.env.ADMIN_USER_ID) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized: Admin access required",
    });
  }

  next();
};

// api/index.ts
export default function handler(req, res) {
  console.log("Environment variable check:", {
    stripeKeyExists: !!process.env.STRIPE_SECRET_KEY,
    awsKeyExists: !!process.env.AWS_ACCESS_KEY_ID,
    databaseUrlExists: !!process.env.DATABASE_URL,
    // Don't log the actual values for security reasons
  });

  // Rest of your handler code
}

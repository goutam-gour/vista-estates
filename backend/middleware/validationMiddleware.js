
export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(
      validations.map((validation) => validation.run(req))
    );

    const { validationResult } = await import("express-validator");
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((error) => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    next();
  };
};

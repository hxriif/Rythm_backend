const TrycatchMiddleware = (TrycatchHandler) => {
    return async (req, res, next) => {
        try {
            await TrycatchHandler(req, res, next);
        } catch (error) {
            res.status(500).json({
                status: "failure",
                message: "error",
                error_message: error.message,
            });
            // Call next with the error parameter to pass the error to the error handling middleware
            next(error);
        }
    };
};

module.exports = TrycatchMiddleware;

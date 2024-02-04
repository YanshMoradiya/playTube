const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    return res.status(err.statusCode).json({ message: err.message, data: err.data, stack: err.stack });
};

export { globalErrorHandler };
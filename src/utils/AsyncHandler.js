// async handler

export default function AsyncHandler(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred");
    }
  };
}
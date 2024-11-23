const router = require("express").Router();

const DocsService = require("../services/docs.service");

router.get("/public-key", async (req, res, next) => {
  try {
    const instance = new DocsService();
    res.status(200).send(instance.getRsaPublic());
  } catch (error) {
    console.log(error);
  }
});

router.post("/upload", async (req, res, next) => {
  try {
    const instance = new DocsService();
    const body = req.body;

    const decrypt = await instance.decrypt(body);

    res.status(decrypt.statusCode ?? 200).json(decrypt);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

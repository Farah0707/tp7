const express = require("express");
const bodyParser = require("body-parser");
const Livre = require("./models/Livre");
require("./database"); 

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/livres", async (req, res) => {
  try {
    const { titre, auteur, date_publication, genre, disponible } = req.body;
    const livre = new Livre({
      titre,
      auteur,
      date_publication,
      genre,
      disponible,
    });
    await livre.save();
    res.status(201).json({ message: "Livre ajouté avec succès", livre });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du livre", error: err.message });
  }
});

app.get("/livres", async (req, res) => {
  try {
    const livres = await Livre.find();
    res.status(200).json(livres);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des livres",
        error: err.message,
      });
  }
});

app.put("/livres/:id", async (req, res) => {
  try {
    const { titre, auteur, date_publication, genre, disponible } = req.body;
    const livre = await Livre.findByIdAndUpdate(
      req.params.id,
      { titre, auteur, date_publication, genre, disponible },
      { new: true } 
    );

    if (!livre) return res.status(404).json({ message: "Livre non trouvé" });

    res.status(200).json({ message: "Livre mis à jour", livre });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la mise à jour du livre",
        error: err.message,
      });
  }
});

app.delete("/livres/:id", async (req, res) => {
  try {
    const livre = await Livre.findByIdAndDelete(req.params.id);
    if (!livre) return res.status(404).json({ message: "Livre non trouvé" });

    res.status(200).json({ message: "Livre supprimé" });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la suppression du livre",
        error: err.message,
      });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

import Ajv from "ajv"
import { Request, Response, Router } from "express"
import { readFileSync } from "fs"
import path from "path"
import DeckLoader from "./game/DeckLoader.js"
import DeckManager from "./game/DeckManager.js"

const ajv = new Ajv()

const CustomDecksSchema = JSON.parse(
  readFileSync(
    path.join(global.__dirname, "/src/CustomDeckSchema.json"),
    "utf8"
  )
)
const validateCustomDecks = ajv.compile(CustomDecksSchema)

const decks = new DeckLoader(
  path.join(global.__dirname, "/decks/cah-cards-full.json")
)

const router = Router()

router.get("/decks", (req: Request, res: Response) => {
  res.json(decks.getDeckInfos())
})
router.post("/createGame", (req: Request, res: Response) => {
  if (!("decks" in req.body || "customDecks" in req.body))
    return res.status(400).json({ error: "No decks selected" })

  const deckManager = new DeckManager()
  if ("decks" in req.body) {
    deckManager.addDecks(req.body.decks, decks)
  }
  if ("customDecks" in req.body) {
    const customDecks = req.body.customDecks
    if (validateCustomDecks(customDecks))
      deckManager.addCustomDecks(req.body.customDecks)
    else return res.status(400).json({ error: "Invalid custom deck Format" })
  }
  let result = global.gameManager.createGame(deckManager.getDeck())

  if (result.error) return res.status(400).json({ error: result.message })
  res.json({ roomID: result.id })
})

export default router

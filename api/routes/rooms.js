import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getAllRooms,
  updateRoom,
  updateRoomAvailability,
  searchRooms,getRoomsByHotel
} from "../controllers/room.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();
//CREATE
router.post("/:hotelid", verifyAdmin, createRoom);

//UPDATE
router.put("/availability/:id", updateRoomAvailability);
router.put("/:id", verifyAdmin, updateRoom);
//DELETE
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);
//GET

router.get("/:id", getRoom);  
//GET ALL

router.get("/", getAllRooms);
router.get('/:city/:startDate/:endDate/:adult/:children/:rooms', searchRooms);
router.get("/hotel/:hotelId", getRoomsByHotel);

export default router;
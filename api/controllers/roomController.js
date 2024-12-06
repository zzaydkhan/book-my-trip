import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

// create
export const createRoom = async (req, res, next) => {
  const hotelid = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();

    // since we want to save this room in one of the hotels therefor
    try {
      await Hotel.findByIdAndUpdate(hotelid, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

// update
export const updateRoom = async (req, res, next) => {
  const id = req.params.id;
  try {
    const updateRoom = await Room.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoomAvailability = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );

    res.status(200).json("Room status has been updated");
  } catch (err) {
    next(err);
  }
};

// delete
export const deleteRoom = async (req, res, next) => {
  const id = req.params.id;
  const hotelid = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(id);
    try {
      await Hotel.findByIdAndUpdate(hotelid, {
        $pull: { rooms: id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("room has been deleted");
  } catch (err) {
    next(err);
  }
};

export const getRoom = async (req, res, next) => {
  const id = req.params.id;
  try {
    const room = await Room.findById(id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

export const getRooms = async (req, res, next) => {
  const id = req.params.id;
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

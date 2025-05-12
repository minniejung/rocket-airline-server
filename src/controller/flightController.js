const flights = require("../repository/flightList");

module.exports = {
  // [GET] /flight
  // 요청 된 departure_times, arrival_times, destination, departure 값과 동일한 값을 가진 항공편 데이터를 조회합니다.
  findAll: (req, res) => {
    try {
      const {
        departure_times = null,
        arrival_times = null,
        departure = null,
        destination = null,
      } = req.query;

      if (typeof req.query !== "object") {
        return res.status(400).json({ error: "Invalid query parameters" });
      }

      const filteredFlights = flights.filter((flight) => {
        return (
          (!departure_times || flight.departure_times === departure_times) &&
          (!arrival_times || flight.arrival_times === arrival_times) &&
          (!departure || flight.departure === departure) &&
          (!destination || flight.destination === destination)
        );
      });

      return res.status(200).json(filteredFlights);
    } catch (err) {
      console.error("🚨 Flight lookup error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // [GET] /flight/:id
  // 요청 된 id 값과 동일한 uuid 값을 가진 항공편 데이터를 조회합니다.
  findById: (req, res) => {
    try {
      const flightId = req.params.id;

      const flight = flights.find((f) => f.uuid === flightId);

      if (!flight) {
        return res.status(404).json({ error: "Flight not found" });
      }

      return res.status(200).json(flight);
    } catch (err) {
      console.error("🚨 Error in findById:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // [PUT] /flight/:id 요청을 수행합니다.
  // 요청 된 id 값과 동일한 uuid 값을 가진 항공편 데이터를 요쳥 된 Body 데이터로 수정합니다.
  update: (req, res) => {
    try {
      const { id } = req.params;
      const updatedFields = req.body;

      if (!updatedFields || typeof updatedFields !== "object") {
        return res.status(400).json({ error: "Invalid update data" });
      }

      const index = flights.findIndex((flight) => flight.uuid === id);
      if (index === -1) {
        return res.status(404).json({ error: "Flight not found" });
      }

      flights[index] = { ...flights[index], ...updatedFields };
      return res.status(200).json(flights[index]);
    } catch (err) {
      console.error("🚨 update error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

const flights = require("../repository/flightList");

module.exports = {
  // [GET] /flight
  // 요청 된 departure_times, arrival_times, destination, departure 값과 동일한 값을 가진 항공편 데이터를 조회합니다.
  findAll: (req, res) => {
    // TODO:
    const { departure_times, arrival_times, departure, destination } =
      req.query;

    const result = flights.filter((flight) => {
      return (
        (!departure_times || flight.departure_times === departure_times) &&
        (!arrival_times || flight.arrival_times === arrival_times) &&
        (!departure || flight.departure === departure) &&
        (!destination || flight.destination === destination)
      );
    });

    return res.json(result);
  },

  // [GET] /flight/:id
  // 요청 된 id 값과 동일한 uuid 값을 가진 항공편 데이터를 조회합니다.
  findById: (req, res) => {
    // TODO:
    const flightId = req.params.id;
    const result = flights.filter((flight) => flight.uuid === flightId);
    return res.json(result);
  },

  // [PUT] /flight/:id 요청을 수행합니다.
  // 요청 된 id 값과 동일한 uuid 값을 가진 항공편 데이터를 요쳥 된 Body 데이터로 수정합니다.
  update: (req, res) => {
    // TODO:
    const { id } = req.params;
    const updated = req.body;

    const index = flights.findIndex((flight) => flight.uuid === id);
    if (index === -1) return res.status(404).send("Not found");

    flights[index] = { ...flights[index], ...updated };
    return res.json(flights[index]);
  },
};

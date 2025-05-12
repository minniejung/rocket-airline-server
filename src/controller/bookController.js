const flights = require("../repository/flightList");
// 항공편 예약 데이터를 저장합니다.
let booking = [];

module.exports = {
  // [GET] /book 요청을 수행합니다.
  // 전체 데이터 혹은 요청 된 flight_uuid, phone 값과 동일한 예약 데이터를 조회합니다.
  findById: (req, res) => {
    try {
      const { flight_uuid, phone } = req.query;

      if (flight_uuid) {
        const matches = booking.filter((b) => b.flight_uuid === flight_uuid);
        if (matches.length === 0) {
          return res
            .status(404)
            .json({ error: "No bookings found for the given flight_uuid" });
        }
        return res.status(200).json(matches);
      }

      if (phone) {
        const match = booking.find((b) => b.phone === phone);
        if (!match) {
          return res
            .status(404)
            .json({ error: "No booking found for the given phone number" });
        }
        return res.status(200).json(match);
      }

      // No query: return all bookings
      return res.status(200).json(booking);
    } catch (err) {
      console.error("🚨 Booking lookup error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // [POST] /book 요청을 수행합니다.
  // 요청 된 예약 데이터를 저장합니다.
  // 응답으로는 book_id를 리턴합니다.
  // Location Header로 예약 아이디를 함께 보내준다면 RESTful한 응답에 더욱 적합합니다.
  // 참고 링크: https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#useful-post-responses
  create: (req, res) => {
    try {
      const { flight_uuid, name, phone } = req.body;

      if (!flight_uuid || !name || !phone) {
        return res
          .status(400)
          .json({ error: "flight_uuid, name, and phone are required" });
      }

      const bookingEntry = { flight_uuid, name, phone };
      booking.push(bookingEntry);

      res.setHeader("Location", `/book?flight_uuid=${flight_uuid}`);
      return res.status(201).json({ book_id: flight_uuid });
    } catch (error) {
      console.error("🚨 Booking creation error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // [DELETE] /book?phone={phone} 요청을 수행합니다.
  // 요청 된 phone 값과 동일한 예약 데이터를 삭제합니다.
  deleteById: (req, res) => {
    try {
      const { phone } = req.query;

      if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      const initialLength = booking.length;
      booking = booking.filter((b) => b.phone !== phone);

      if (booking.length === initialLength) {
        return res
          .status(404)
          .json({ error: "No booking found with that phone number" });
      }

      return res
        .status(200)
        .json({ message: "Booking deleted", remaining: booking });
    } catch (err) {
      console.error("🚨 Delete booking error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

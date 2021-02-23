import { Op } from 'sequelize';
import { setSeconds, setMinutes, setHours, isAfter, isBefore } from 'date-fns';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DeliveryController {
  async index(req, res) {
    const { id } = req.params;
    const { page = 1, delivered = null } = req.query;

    if (delivered) {
      const deliveries = await Delivery.findAll({
        limit: 20,
        offset: (page - 1) * 20,
        where: {
          end_date: { [Op.ne]: null },
        },
      });

      if (!delivered) {
        return res
          .status(400)
          .json({ error: 'There is no delivery for this deliveryman' });
      }

      return res.json(deliveries);
    }

    const deliveries = await Delivery.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: null,
      },
    });

    if (!deliveries) {
      return res
        .status(400)
        .json({ error: 'There is no delivery for this deliveryman' });
    }

    return res.json(deliveries);
  }

  async update(req, res) {
    const { withdraw } = req.body || false;

    if (!withdraw) {
      return res.status(400).json({ error: 'Invalid operation' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Invalid deliveryman' });
    }

    const delivery = await Delivery.findByPk(req.params.delivery);

    if (!delivery) {
      return res.status(400).json({ error: 'Invalid delivery' });
    }

    const schedule = ['08:00', '19:00'];
    const dateNow = new Date();

    const [startOfDay, endOfDay] = schedule.map((time) => {
      const [hour, minute] = time.split(':');
      return setSeconds(setMinutes(setHours(dateNow, hour), minute), 0);
    });

    const available =
      isAfter(dateNow, startOfDay) && isBefore(dateNow, endOfDay);

    if (!available) {
      return res.status(400).json({ error: 'Out of hours' });
    }

    const maxDeliveryCount = await Delivery.count({
      where: {
        deliveryman_id: deliveryman.id,
        start_date: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    if (maxDeliveryCount >= 5) {
      return res
        .status(400)
        .json({ error: 'Maximum deliveries of day reached' });
    }

    delivery.start_date = new Date();

    await delivery.save();

    return res.json({ delivery });
  }
}

export default new DeliveryController();

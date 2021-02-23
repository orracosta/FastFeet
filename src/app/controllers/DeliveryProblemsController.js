import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliveryProblemsController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveryProblems = await DeliveryProblem.findAll({
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(deliveryProblems);
  }

  async show(req, res) {
    const { delivery_id } = req.params;
    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const deliveryProblems = await DeliveryProblem.findAll({
      where: {
        delivery_id,
      },
    });

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { delivery_id } = req.params;
    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Invalid delivery ID' });
    }

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id,
      description: req.body.description,
    });

    return res.json(deliveryProblem);
  }

  async delete(req, res) {
    const { problem_id } = req.params;
    const deliveryProblem = await DeliveryProblem.findByPk(problem_id);

    if (!deliveryProblem) {
      return res.status(400).json({ error: 'Problem ID is invalid' });
    }

    const delivery = await Delivery.findByPk(deliveryProblem.delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    delivery.canceled_at = new Date();
    await delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryProblemsController();

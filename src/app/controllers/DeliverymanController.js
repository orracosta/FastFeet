import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliverys = await Deliveryman.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverys);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!schema.isValid()) {
      return res.json({ error: 'Validation fails' });
    }

    const delivery = await Deliveryman.findByPk(req.params.id);

    if (!delivery) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const { email } = req.body;

    if (email !== delivery.email) {
      const emailTaken = await Deliveryman.findOne({
        where: {
          email,
        },
      });

      if (emailTaken) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }

    const { id, name } = await delivery.update(req.body);

    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const delivery = await Deliveryman.findByPk(req.params.id);

    if (!delivery) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    await delivery.destroy();

    return res.json({ error: 'Deliveryman removed with success' });
  }
}

export default new DeliverymanController();

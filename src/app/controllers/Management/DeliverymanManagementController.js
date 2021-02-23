import * as Yup from 'yup';

import Deliveryman from '../../models/Deliveryman';
import File from '../../models/File';

class DeliverymanManagementController {
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

    if (!schema.isValid() && !req.file) {
      return res.json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    if (req.file) {
      const { originalname: name, filename: path } = req.file;

      const file = await File.create({
        name,
        path,
      });

      deliveryman.avatar_id = file.id;
      await deliveryman.save();

      return res.json(file);
    }

    const { email } = req.body;

    if (email !== deliveryman.email) {
      const emailTaken = await Deliveryman.findOne({
        where: {
          email,
        },
      });

      if (emailTaken) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }

    const { id, name } = await deliveryman.update(req.body);

    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    await deliveryman.destroy();

    return res.json({ success: 'Deliveryman removed with success' });
  }
}

export default new DeliverymanManagementController();

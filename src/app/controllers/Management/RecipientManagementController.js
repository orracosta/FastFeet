import * as Yup from 'yup';

import Recipient from '../../models/Recipient';

class RecipientManagementController {
  async index(req, res) {
    const recipients = await Recipient.findAll();

    return res.json(recipients.sort((a, b) => a.id - b.id));
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient name already exists.' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zip: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    const result = await recipient.update(req.body);

    return res.json(result);
  }
}

export default new RecipientManagementController();

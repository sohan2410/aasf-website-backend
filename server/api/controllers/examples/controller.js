import ExamplesService from '../../services/examples.service';

export class Controller {
  async all(_, res) {
    const r = await ExamplesService.all();
    res.json(r);
  }

  async byId(req, res) {
    const r = ExamplesService.byId(req.params.id);
    if (r) res.json(r);
    else res.status(404).end();
  }

  async create(req, res) {
    const r = ExamplesService.create(req.body.name);
    res
      .status(201)
      .location(`/api/v1/examples/${r.id}`)
      .json(r);
  }
}
export default new Controller();

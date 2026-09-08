import AddUserUseCase from '../../../../Applications/use_case/AddUserUseCase.js';

class UsersHandler {
  #container;

  constructor(container) {
    this.#container = container;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(req, res, next) {
    try {
      const addUserUseCase = this.#container.getInstance(AddUserUseCase.name);
      const addedUser = await addUserUseCase.execute(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          addedUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UsersHandler;
